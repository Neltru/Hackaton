import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvStatusComponent } from './cv-status.component';

describe('CvStatusComponent', () => {
  let component: CvStatusComponent;
  let fixture: ComponentFixture<CvStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CvStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
