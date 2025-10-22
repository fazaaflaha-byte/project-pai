import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoaDetailComponent } from './doa-detail.component';

describe('DoaDetailComponent', () => {
  let component: DoaDetailComponent;
  let fixture: ComponentFixture<DoaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
