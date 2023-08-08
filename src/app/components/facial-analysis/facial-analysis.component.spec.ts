import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacialAnalysisComponent } from './facial-analysis.component';

describe('FacialAnalysisComponent', () => {
  let component: FacialAnalysisComponent;
  let fixture: ComponentFixture<FacialAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacialAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacialAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
