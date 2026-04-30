import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { VacantesComponent } from './vacantes.component';

describe('VacantesComponent', () => {
  let component: VacantesComponent;
  let fixture: ComponentFixture<VacantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacantesComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VacantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
