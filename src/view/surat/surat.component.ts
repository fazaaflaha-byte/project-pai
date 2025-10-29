// surat/surat.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SurahService } from '../../app/service/surat.service';

@Component({
  selector: 'app-surat',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './surat.component.html',
  styleUrls: ['./surat.component.css']
})
export class SuratComponent implements OnInit, AfterViewInit, OnDestroy {
  surats: any[] = [];
  filteredSurats: any[] = [];
  loading = true;
  searchQuery: string = '';
  private observer?: IntersectionObserver;
  private lastScrollY = 0;

  constructor(
    private surahService: SurahService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.surahService.getAllSurat().subscribe({
      next: (res: any) => {
        this.surats = res.data;
        this.applyFilterFromQuery();
        this.loading = false;
        
        // Setup animation setelah data loaded
        setTimeout(() => {
          this.setupScrollAnimation();
        }, 100);
      },
      error: (err) => {
        console.error('❌ Gagal memuat surat:', err);
        this.loading = false;
      }
    });

    // Listen query parameter change
    this.route.queryParams.subscribe(() => {
      this.applyFilterFromQuery();
      // Re-setup animation setelah filter
      setTimeout(() => {
        this.setupScrollAnimation();
      }, 100);
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupScrollAnimation() {
    // Lindungi agar tidak jalan di server
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    this.lastScrollY = window.scrollY;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > this.lastScrollY;
      this.lastScrollY = currentScrollY;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          entry.target.classList.remove('animate-out');
        } else {
          if (!isScrollingDown && entry.boundingClientRect.top > window.innerHeight) {
            entry.target.classList.add('animate-out');
            entry.target.classList.remove('animate-in');
          }
        }
      });
    }, options);

    // observe semua surat cards
    const cards = document.querySelectorAll('.surat-card');
    cards.forEach((card) => {
      this.observer?.observe(card);
    });
  }

  private applyFilterFromQuery() {
    const q = this.route.snapshot.queryParamMap.get('q')?.toLowerCase() || '';
    if (q) {
      this.searchQuery = q;
      this.filteredSurats = this.surats.filter(
        s =>
          s.namaLatin.toLowerCase().includes(q) ||
          s.nama.toLowerCase().includes(q) ||
          s.arti.toLowerCase().includes(q)
      );
    } else {
      this.filteredSurats = [...this.surats];
    }
  }

  filterSurats(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredSurats = [...this.surats];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredSurats = this.surats.filter(surat => 
        surat.namaLatin.toLowerCase().includes(query) ||
        surat.nama.toLowerCase().includes(query) ||
        surat.arti.toLowerCase().includes(query) ||
        surat.nomor.toString().includes(query)
      );
    }
    
    setTimeout(() => {
      this.setupScrollAnimation();
    }, 100);
  }
}
