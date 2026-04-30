import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionResultsComponent } from './dimension-results.component';

describe('DimensionResultsComponent', () => {
  let component: DimensionResultsComponent;
  let fixture: ComponentFixture<DimensionResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimensionResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DimensionResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
