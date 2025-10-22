import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratDetailComponent } from './surat-detail.component';

describe('SuratDetailComponent', () => {
  let component: SuratDetailComponent;
  let fixture: ComponentFixture<SuratDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuratDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
