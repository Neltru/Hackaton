import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CvStatusComponent } from './cv-status.component';

describe('CvStatusComponent', () => {
  let component: CvStatusComponent;
  let fixture: ComponentFixture<CvStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvStatusComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
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
