import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-appbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.css']
})
export class AppbarComponent {
  mobileMenuOpen = false;
  searchPlaceholder = 'Cari surat, ayat...';
  searchQuery = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Update placeholder awal
    this.updateSearchPlaceholder(this.router.url);

    // Dengarkan perubahan URL agar placeholder menyesuaikan halaman
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateSearchPlaceholder(event.urlAfterRedirects);
      });
  }

  /** 🔄 Ubah placeholder berdasarkan route aktif */
  updateSearchPlaceholder(url: string): void {
    if (url.includes('/al-masurat')) {
      this.searchPlaceholder = 'Cari doa Al-Ma\'surat...';
    } else if (url.includes('/murotal')) {
      this.searchPlaceholder = 'Cari murotal...';
    } else if (url.includes('/surat')) {
      this.searchPlaceholder = 'Cari surat...';
    } else {
      this.searchPlaceholder = 'Cari surat, ayat...';
    }
  }

  /** 📱 Toggle menu mobile */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /** 🔒 Tutup menu mobile */
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  /** 🔍 Fungsi ketika tekan Enter di search */
  onSearch(): void {
    if (!this.searchQuery.trim()) return;

    console.log('🔍 Mencari:', this.searchQuery);

    // Contoh redirect ke halaman hasil pencarian (opsional)
    this.router.navigate(['/surat'], { queryParams: { q: this.searchQuery } });

    this.searchQuery = '';
    this.closeMobileMenu();
  }
}
