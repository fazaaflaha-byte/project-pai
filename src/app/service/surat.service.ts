// surat.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Interface untuk typing (OPSIONAL, tapi lebih bagus)
export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;      // ← INI YANG PENTING!
  teksIndonesia: string;
  audio: any;
}

export interface Surat {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: any;
  ayat: Ayat[];           // ← Array ayat dengan teksLatin
}

@Injectable({
  providedIn: "root"
})
export class SurahService {
  private baseUrl = 'https://equran.id/api/v2';

  constructor(private http: HttpClient) {}

  // ✅ Daftar semua surat
  getAllSurat(): Observable<any> {
    return this.http.get(`${this.baseUrl}/surat`);
  }

  // ✅ Detail surat + ayat + audio
  getSuratByNomor(nomor: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/surat/${nomor}`);
  }

  // ✅ Tafsir surat (opsional)
  getTafsirByNomor(nomor: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tafsir/${nomor}`);
  }
}