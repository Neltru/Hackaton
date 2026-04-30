import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumniLayoutComponent } from './alumni-layout.component';

describe('AlumniLayoutComponent', () => {
  let component: AlumniLayoutComponent;
  let fixture: ComponentFixture<AlumniLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumniLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlumniLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
