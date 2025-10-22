import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioSignalService {
  // Menyimpan status global audio
  currentAudioUrl = signal<string | null>(null);
  isPlaying = signal<boolean>(false);

  setAudio(url: string | null, playing: boolean): void {
    this.currentAudioUrl.set(url);
    this.isPlaying.set(playing);
  }

  stop(): void {
    this.currentAudioUrl.set(null);
    this.isPlaying.set(false);
  }
}
