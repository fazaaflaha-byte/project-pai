import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
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
  imports: [NgFor, NgIf, KeyValuePipe, FormsModule],
  templateUrl: './murotal.component.html',
  styleUrls: ['./murotal.component.css']
})
export class MurotalComponent implements OnInit, OnDestroy {
  semuaSurat: SuratData[] = [];
  filteredSurat: SuratData[] = [];
  audioPlayer: HTMLAudioElement | null = null;
  loading = true;
  searchQuery: string = '';

  currentAudioUrl!: () => string | null;
  isPlaying!: () => boolean;

  constructor(
    private surahService: SurahService,
    private audioSignal: AudioSignalService
  ) {}

  ngOnInit(): void {
    this.currentAudioUrl = this.audioSignal.currentAudioUrl;
    this.isPlaying = this.audioSignal.isPlaying;

    this.surahService.getAllSurat().subscribe({
      next: (res) => {
        this.semuaSurat = res.data;
        this.filteredSurat = [...this.semuaSurat];
        this.loading = false;
      },
      error: (err) => {
        console.error('Gagal mengambil daftar surat:', err);
        this.loading = false;
      }
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

  ngOnDestroy(): void {
    this.stopAudio();
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
  }
}
