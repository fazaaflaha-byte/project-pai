// Murotal.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // ✅ TAMBAH INI
import { SurahService } from '../../app/service/surat.service';
import { AudioSignalService } from '../../app/service/signal.service';
import { FormsModule } from '@angular/forms';

interface AudioMap {
  [key: string]: string;
}

interface SuratData {
  nomor: number;
  namaLatin: string;
  arti: string;
  tempatTurun: string;
  jumlahAyat: number;
  audioFull?: AudioMap;
}

@Component({
  selector: 'app-murotal',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './murotal.component.html',
  styleUrls: ['./murotal.component.css']
})
export class MurotalComponent implements OnInit, AfterViewInit, OnDestroy {
  semuaSurat: SuratData[] = [];
  filteredSurat: SuratData[] = [];
  audioPlayer: HTMLAudioElement | null = null;
  loading = true;
  searchQuery: string = '';
  
  private observer?: IntersectionObserver;
  private lastScrollY = 0;

  currentAudioUrl!: () => string | null;
  isPlaying!: () => boolean;

  constructor(
    private surahService: SurahService,
    private audioSignal: AudioSignalService,
    private route: ActivatedRoute // ✅ INJECT ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentAudioUrl = this.audioSignal.currentAudioUrl;
    this.isPlaying = this.audioSignal.isPlaying;

    this.surahService.getAllSurat().subscribe({
      next: (res) => {
        this.semuaSurat = res.data;
        this.filteredSurat = [...this.semuaSurat];
        this.loading = false;

        // ✅ BACA QUERY PARAMS SETELAH DATA LOADED
        this.route.queryParams.subscribe(params => {
          const query = params['q'];
          if (query) {
            this.searchQuery = query;
            this.filterSurat();
          }
        });

        // Setup animation setelah data loaded
        setTimeout(() => {
          this.setupScrollAnimation();
        }, 100);
      },
      error: (err) => {
        console.error('Gagal mengambil daftar surat:', err);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Akan di-setup setelah data loaded
  }

  ngOnDestroy(): void {
    this.stopAudio();
    
    // Cleanup observer saat component destroyed
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupScrollAnimation() {
    // Disconnect observer lama jika ada
    if (this.observer) {
      this.observer.disconnect();
    }

    this.lastScrollY = window.scrollY;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger saat 10% card terlihat
    };

    this.observer = new IntersectionObserver((entries) => {
      // Deteksi arah scroll
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > this.lastScrollY;
      this.lastScrollY = currentScrollY;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Card masuk viewport - tambah animate-in, hapus animate-out
          entry.target.classList.add('animate-in');
          entry.target.classList.remove('animate-out');
        } else {
          // Card keluar viewport
          // Jika scroll ke atas DAN card ada di bawah viewport, tambah animate-out
          if (!isScrollingDown && entry.boundingClientRect.top > window.innerHeight) {
            entry.target.classList.add('animate-out');
            entry.target.classList.remove('animate-in');
          }
        }
      });
    }, options);

    // Observe semua murotal cards
    const cards = document.querySelectorAll('.murotal-card');
    cards.forEach((card) => {
      this.observer?.observe(card);
    });
  }

  playAudio(url?: string): void {
    if (!url) return;

    if (this.currentAudioUrl() === url && this.isPlaying()) {
      this.stopAudio();
      return;
    }

    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }

    this.audioPlayer = new Audio(url);
    this.audioPlayer.play()
      .then(() => this.audioSignal.setAudio(url, true))
      .catch(err => console.error('Gagal memutar audio:', err));

    this.audioPlayer.onended = () => this.audioSignal.stop();
  }

  stopAudio(): void {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      this.audioPlayer = null;
    }
    this.audioSignal.stop();
  }

  /** 🔎 Filter surat berdasarkan searchQuery */
  filterSurat() {
    const q = this.searchQuery.toLowerCase().trim();
    
    if (q) {
      this.filteredSurat = this.semuaSurat.filter(s =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.tempatTurun.toLowerCase().includes(q)
      );
    } else {
      this.filteredSurat = [...this.semuaSurat];
    }

    // Re-setup animation setelah filter
    setTimeout(() => {
      this.setupScrollAnimation();
    }, 100);
  }
}