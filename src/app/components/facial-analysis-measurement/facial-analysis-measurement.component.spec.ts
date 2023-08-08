import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacialAnalysisMeasurementComponent } from './facial-analysis-measurement.component';

describe('FacialAnalysisMeasurementComponent', () => {
  let component: FacialAnalysisMeasurementComponent;
  let fixture: ComponentFixture<FacialAnalysisMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacialAnalysisMeasurementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacialAnalysisMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
