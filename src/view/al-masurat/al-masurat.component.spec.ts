import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlMasuratComponent } from './al-masurat.component';

describe('AlMasuratComponent', () => {
  let component: AlMasuratComponent;
  let fixture: ComponentFixture<AlMasuratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlMasuratComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlMasuratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
