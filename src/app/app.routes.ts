import { Routes } from '@angular/router';
import { AlMasuratComponent } from '../view/al-masurat/al-masurat.component';
import { SuratComponent } from '../view/surat/surat.component';
import { MurotalComponent } from '../view/murotal/murotal.component';
import { SuratDetailComponent } from '../view/surat-detail/surat-detail.component';
import { DoaDetailComponent } from '../view/doa-detail/doa-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/surat', pathMatch: 'full' },
  {path: 'al-masurat', component: AlMasuratComponent},
  {path: 'al-masurat/:id', component: DoaDetailComponent},

  {path: 'surat', component: SuratComponent},
  {path: 'murotal', component: MurotalComponent},
  {path: 'surat/:nomor', component: SuratDetailComponent},
  { path: '**', redirectTo: '/al-masurat' } ,


];
