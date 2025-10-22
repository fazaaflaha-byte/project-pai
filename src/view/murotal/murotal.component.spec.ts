import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MurotalComponent } from './murotal.component';

describe('MurotalComponent', () => {
  let component: MurotalComponent;
  let fixture: ComponentFixture<MurotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MurotalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MurotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
