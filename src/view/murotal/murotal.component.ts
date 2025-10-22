import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { SurahService } from '../../app/service/surat.service';

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
  imports: [NgFor, NgIf, KeyValuePipe],
  templateUrl: './murotal.component.html',
  styleUrls: ['./murotal.component.css']
})
export class MurotalComponent implements OnInit {
  semuaSurat: SuratData[] = [];
  selectedAudio: string | null = null;
  audioPlayer: HTMLAudioElement | null = null;
  loading = true;

  constructor(private surahService: SurahService) {}

  ngOnInit(): void {
    this.surahService.getAllSurat().subscribe({
      next: (res) => {
        this.semuaSurat = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Gagal mengambil daftar surat:', err);
        this.loading = false;
      }
    });
  }

  playAudio(url?: string): void {
    if (!url) {
      console.warn('Audio tidak tersedia untuk surat ini.');
      return;
    }

    // Jika audio sedang dimainkan dan sama, hentikan
    if (this.selectedAudio === url && this.audioPlayer) {
      this.stopAudio();
      return;
    }

    // Hentikan audio lama
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }

    // Mainkan audio baru
    this.audioPlayer = new Audio(url);
    this.selectedAudio = url;
    this.audioPlayer.play().catch(err => console.error('Gagal memutar audio:', err));
  }

  stopAudio(): void {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      this.audioPlayer = null;
      this.selectedAudio = null;
    }
  }
}
