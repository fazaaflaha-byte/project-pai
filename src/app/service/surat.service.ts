import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
