import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SurahService } from '../../app/service/surat.service';

@Component({
  selector: 'app-surat',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './surat.component.html',
  styleUrls: ['./surat.component.css']
})
export class SuratComponent implements OnInit {
  surats: any[] = [];
  filteredSurats: any[] = [];
  loading = true;

  constructor(
    private surahService: SurahService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.surahService.getAllSurat().subscribe({
      next: (res: any) => {
        this.surats = res.data;
        this.applyFilterFromQuery();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Gagal memuat surat:', err);
        this.loading = false;
      }
    });

    // Listen query parameter change
    this.route.queryParams.subscribe(() => {
      this.applyFilterFromQuery();
    });
  }

  private applyFilterFromQuery() {
    const q = this.route.snapshot.queryParamMap.get('q')?.toLowerCase() || '';
    if (q) {
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
}
