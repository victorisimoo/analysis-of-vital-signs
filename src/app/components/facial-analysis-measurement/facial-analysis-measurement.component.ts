import { Component, Input, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-facial-analysis-measurement',
  templateUrl: './facial-analysis-measurement.component.html',
  styleUrls: ['./facial-analysis-measurement.component.scss']
})
export class FacialAnalysisMeasurementComponent implements OnInit, AfterViewInit {
  @Input() icon: string;
  @Input() value: number | string;
  @Input() title: string;
  @Input() isLoading: boolean;
  @Input() color: string;


  @ViewChild('iconImg') iconImg!: ElementRef
  constructor(private render: Renderer2) {
    this.icon = "";
    this.value = 0;
    this.title = "";
    this.isLoading = false;
    this.color = "#000000";
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.render.setStyle(this.iconImg.nativeElement, "filter", `opacity(0.5) drop-shadow(0 0 0 ${this.color}) saturate(4)`);
  }

}
