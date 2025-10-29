// surat-detail.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SurahService } from '../../app/service/surat.service';

@Component({
  selector: 'app-surat-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './surat-detail.component.html',
  styleUrls: ['./surat-detail.component.css']
})
export class SuratDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  surat: any;
  loading = true;
  private observer?: IntersectionObserver;
  private lastScrollY = 0;

  constructor(
    private route: ActivatedRoute,
    private surahService: SurahService
  ) {}

  ngOnInit() {
    const nomor = Number(this.route.snapshot.paramMap.get('nomor'));
    this.surahService.getSuratByNomor(nomor).subscribe({
      next: (res: any) => {
        this.surat = res.data;

        console.log('Sample teksLatin:', this.surat.ayat[0]?.teksLatin);
        
        this.loading = false;
        
        // Setup animation setelah data loaded
        setTimeout(() => {
          this.setupScrollAnimation();
        }, 100);
      },
      error: (err) => {
        console.error('❌ Gagal memuat detail surat:', err);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    // Akan di-setup setelah data loaded
  }

  ngOnDestroy() {
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

    // Observe semua ayat cards
    const cards = document.querySelectorAll('.ayat-card');
    cards.forEach((card) => {
      this.observer?.observe(card);
    });
  }
}