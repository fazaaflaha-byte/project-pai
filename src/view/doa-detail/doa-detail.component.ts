import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Doa, MasuratService } from '../../app/service/doa.service';

@Component({
  selector: 'app-doa-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doa-detail.component.html',
  styleUrls: ['./doa-detail.component.css']
})
export class DoaDetailComponent implements OnInit {
  doa?: Doa;
  loading = true;

  constructor(private route: ActivatedRoute, private masuratService: MasuratService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.masuratService.getDoaById(id).subscribe({
        next: (res) => {
          this.doa = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Gagal memuat doa:', err);
          this.loading = false;
        }
      });
    }
  }
}
