import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ApplicationsListComponent } from './applications-list.component';

describe('ApplicationsListComponent', () => {
  let component: ApplicationsListComponent;
  let fixture: ComponentFixture<ApplicationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
