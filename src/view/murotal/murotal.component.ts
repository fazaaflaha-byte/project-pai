import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { SurahService } from '../../app/service/surat.service';
import { AudioSignalService } from '../../app/service/signal.service';

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
export class MurotalComponent implements OnInit, OnDestroy {
  semuaSurat: SuratData[] = [];
  audioPlayer: HTMLAudioElement | null = null;
  loading = true;

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

    // Jika sedang main dan URL sama → stop
    if (this.currentAudioUrl() === url && this.isPlaying()) {
      this.stopAudio();
      return;
    }

    // Stop audio lama
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }

    // Mainkan audio baru
    this.audioPlayer = new Audio(url);
    this.audioPlayer.play()
      .then(() => this.audioSignal.setAudio(url, true))
      .catch(err => console.error('Gagal memutar audio:', err));

    // Update global signal saat audio selesai
    this.audioPlayer.onended = () => {
      this.audioSignal.stop();
    };
  }

  stopAudio(): void {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      this.audioPlayer = null;
    }
    this.audioSignal.stop();
  }

  // ✅ Tambahkan ini agar berhenti otomatis saat berpindah halaman
  ngOnDestroy(): void {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      this.audioPlayer = null;
    }
    this.audioSignal.stop();
  }
}
