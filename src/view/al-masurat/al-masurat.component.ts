// al-masurat.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Doa, MasuratService } from '../../app/service/doa.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-al-masurat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './al-masurat.component.html',
  styleUrls: ['./al-masurat.component.css']
})
export class AlMasuratComponent implements OnInit, AfterViewInit, OnDestroy {
  doaList: Doa[] = [];
  filteredDoaList: Doa[] = [];
  loading = true;
  searchQuery: string = '';
  private observer?: IntersectionObserver;
  private lastScrollY = 0;

  constructor(
    private masuratService: MasuratService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.masuratService.getAllDoa().subscribe({
      next: (res) => {
        this.doaList = res.data;
        this.filteredDoaList = [...this.doaList];
        this.applyFilterFromQuery();
        
        // Setup animation setelah data loaded
        setTimeout(() => {
          this.setupScrollAnimation();
        }, 100);
      },
      error: (err) => {
        console.error('❌ Gagal memuat doa:', err);
        this.loading = false;
      }
    });

    // Listen perubahan query param
    this.route.queryParams.subscribe(() => {
      this.applyFilterFromQuery();
      // Re-setup animation setelah filter
      setTimeout(() => {
        this.setupScrollAnimation();
      }, 100);
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

    // Observe semua doa cards
    const cards = document.querySelectorAll('.doa-card');
    cards.forEach((card) => {
      this.observer?.observe(card);
    });
  }

  /** 🔎 Filter daftar doa berdasarkan searchQuery atau query param */
  private applyFilterFromQuery() {
    const q = this.route.snapshot.queryParamMap.get('q')?.toLowerCase() || '';
    this.searchQuery = q;

    if (q) {
      this.filteredDoaList = this.doaList.filter(d =>
        d.nama.toLowerCase().includes(q) || d.grup.toLowerCase().includes(q)
      );
    } else {
      this.filteredDoaList = [...this.doaList];
    }

    this.loading = false;
  }

  /** Buka detail doa */
  openDetail(doa: Doa) {
    this.router.navigate(['/al-masurat', doa.id]);
  }

  /** Filter manual ketika user mengetik di halaman */
  filterDoa() {
    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      this.filteredDoaList = this.doaList.filter(d =>
        d.nama.toLowerCase().includes(q) || d.grup.toLowerCase().includes(q)
      );
    } else {
      this.filteredDoaList = [...this.doaList];
    }
    
    // Re-setup animation setelah filter
    setTimeout(() => {
      this.setupScrollAnimation();
    }, 100);
  }
}