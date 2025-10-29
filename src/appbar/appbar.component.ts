// appbar.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // ✅ Tambahkan OnInit
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
export class AppbarComponent implements OnInit { // ✅ Implement OnInit
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
      this.searchPlaceholder = 'Cari doa...';
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
    const query = this.searchQuery.trim();
    
    // ✅ Validasi input kosong
    if (!query) {
      console.log('Query kosong, search dibatalkan');
      return;
    }

    // ✅ Tentukan target route
    let targetRoute = '/surat'; // default

    if (this.router.url.includes('/al-masurat')) {
      targetRoute = '/al-masurat';
    } else if (this.router.url.includes('/murotal')) {
      targetRoute = '/murotal';
    }

    console.log('🔍 Searching:', query, 'in', targetRoute); // ✅ Debug log

    // ✅ Navigate dengan query params
    this.router.navigate([targetRoute], { 
      queryParams: { q: query },
      queryParamsHandling: 'merge' // ✅ Merge dengan params yang ada
    }).then(success => {
      console.log('Navigation success:', success);
      if (success) {
        this.searchQuery = ''; // ✅ Clear hanya jika berhasil
        this.closeMobileMenu();
      }
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }
}