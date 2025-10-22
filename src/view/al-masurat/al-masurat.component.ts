import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Doa, MasuratService } from '../../app/service/doa.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-al-masurat',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './al-masurat.component.html',
  styleUrls: ['./al-masurat.component.css']
})
export class AlMasuratComponent implements OnInit {
  doaList: Doa[] = [];
  filteredDoaList: Doa[] = [];
  loading = true;
  searchQuery: string = '';

  constructor(
    private masuratService: MasuratService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.masuratService.getAllDoa().subscribe({
      next: (res) => {
        this.doaList = res.data;
        this.filteredDoaList = [...this.doaList];
        this.applyFilterFromQuery();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });

    // Listen perubahan query param
    this.route.queryParams.subscribe(() => {
      this.applyFilterFromQuery();
    });
  }

  /** 🔎 Filter daftar doa berdasarkan searchQuery atau query param */
  private applyFilterFromQuery() {
    const q = this.route.snapshot.queryParamMap.get('q')?.toLowerCase() || '';
    this.searchQuery = q;

    if (q) {
      this.filteredDoaList = this.doaList.filter(d =>
        d.nama.toLowerCase().includes(q) || d.grup.toLowerCase().includes(q)
      );
    } else {
      this.filteredDoaList = [...this.doaList];
    }

    this.loading = false;
  }

  /** Buka detail doa */
  openDetail(doa: Doa) {
    this.router.navigate(['/al-masurat', doa.id]);
  }

  /** Filter manual ketika user mengetik di halaman */
  filterDoa() {
    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      this.filteredDoaList = this.doaList.filter(d =>
        d.nama.toLowerCase().includes(q) || d.grup.toLowerCase().includes(q)
      );
    } else {
      this.filteredDoaList = [...this.doaList];
    }
  }
}
