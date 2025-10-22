import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Doa {
  judul: any;
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  tag: string[];
}

@Injectable({
  providedIn: 'root',
})
export class MasuratService {
  private apiUrl = 'https://equran.id/api/doa';

  constructor(private http: HttpClient) {}

  // 🔹 Ambil semua doa
  getAllDoa(): Observable<{ status: string; total: number; data: Doa[] }> {
    return this.http.get<{ status: string; total: number; data: Doa[] }>(this.apiUrl);
  }

  // 🔹 Ambil 1 doa berdasarkan id
  getDoaById(id: string): Observable<Doa> {
    return this.http.get<{ status: string; total: number; data: Doa[] }>(this.apiUrl).pipe(
      map((res) => {
        const doa = res.data.find((d) => d.id === Number(id));
        if (!doa) throw new Error('Doa tidak ditemukan');
        return doa;
      })
    );
  }
}
