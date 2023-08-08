import { TranslationsHelper } from 'src/app/helpers/translations';

import { MediaDevicesHelper } from 'src/app/helpers/mediaDevices';


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FacialAnalysisComponent } from './components/facial-analysis/facial-analysis.component';
import { FacialAnalysisMeasurementComponent } from './components/facial-analysis-measurement/facial-analysis-measurement.component';
import { ApiService } from './services/api.services';
import { NotificationHelper } from './helpers/notifications';
import { TranslationService } from './services/translations.service';
import { ColorService } from './services/colors.service';


@NgModule({
  declarations: [
    AppComponent,
    FacialAnalysisComponent,
    FacialAnalysisMeasurementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    MediaDevicesHelper,
    ApiService,
    NotificationHelper,
    TranslationsHelper,
    TranslationService,
    ColorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
