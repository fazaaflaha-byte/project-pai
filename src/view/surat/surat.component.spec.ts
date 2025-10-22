import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratComponent } from './surat.component';

describe('SuratComponent', () => {
  let component: SuratComponent;
  let fixture: ComponentFixture<SuratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
