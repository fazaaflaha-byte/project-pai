import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  loading = true;

  constructor(private surahService: SurahService) {}

  ngOnInit() {
    this.surahService.getAllSurat().subscribe({
      next: (res: any) => {
        this.surats = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Gagal memuat surat:', err);
        this.loading = false;
      }
    });
  }
}
