import { Component, OnInit } from '@angular/core';
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
export class SuratDetailComponent implements OnInit {
  surat: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private surahService: SurahService
  ) {}

  ngOnInit() {
    const nomor = Number(this.route.snapshot.paramMap.get('nomor'));
    this.surahService.getSuratByNomor(nomor).subscribe({
      next: (res: any) => {
        this.surat = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Gagal memuat detail surat:', err);
        this.loading = false;
      }
    });
  }
}
