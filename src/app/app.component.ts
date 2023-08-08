import { TranslationService } from './services/translations.service';
import { TranslationsHelper } from 'src/app/helpers/translations';

import { ApiService } from './services/api.services';
import { qParams } from './classes/queryParams.class';
import { QueryParamsService } from './services/query-params.service';
import { Component, ElementRef, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { NotificationHelper } from './helpers/notifications';
import { ColorService } from './services/colors.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('navbar') navbar!: ElementRef;
  @ViewChild('buttoninit') buttoninit!: ElementRef;
  @ViewChild('loaderOverlay') loaderOverlay!: ElementRef;
  @ViewChild('loader') loader!: ElementRef;

  favIcon!: any;
  appTitle!: any;

  queryParamsConfig: qParams;
  constructor(
    private render: Renderer2,
    private notificationHelper: NotificationHelper,
    private queryParamsService: QueryParamsService,
    public translationHelper: TranslationsHelper,
    private translationService: TranslationService,
    private colorService: ColorService,
    private apiService: ApiService) {

    this.queryParamsConfig = new qParams();
    

  }

  ngOnInit(): void {
    this.queryParamsConfig = this.queryParamsService.getQueryParams();
  }

  async ngAfterViewInit() {
    
    this.render.setStyle(this.navbar.nativeElement, "background-color", this.queryParamsConfig.pcolor)
    this.render.setStyle(document.body, "background-image", `url(${this.queryParamsConfig.bg})`);
    this.render.setStyle(this.loaderOverlay.nativeElement, "background-color", `rgba(${this.colorService.convertHexToRgb(this.queryParamsConfig.pcolor)}, 1`);
    
    if(this.colorService.lightOrDark(this.queryParamsConfig.pcolor) === 'dark') {
      this.render.setStyle(this.loader.nativeElement, "color", "#ffffff");
    }

    this.favIcon = document.querySelector('#favicon-el') as any;
    this.appTitle = document.querySelector('#title-el') as any;
    this.favIcon.href = this.queryParamsConfig.fic;
    this.appTitle.textContent = this.queryParamsConfig.cnam;

    await this.translationService.requestTranslations();
    
    this.render.setStyle(this.loaderOverlay.nativeElement, "display", "none");

  }

  showInstructions() {
    const title = this.translationHelper.getTranslationByKey('SV_INFO_TITLE');
    const content = this.translationHelper.getTranslationByKey('SV_INFO_MESSAGE');

    this.notificationHelper.showHTMLModal(title, content, 'info', this.translationHelper.getTranslationByKey('VS_AGREED'),);
  }

  endSession() {
    this.notificationHelper.showConfirmation(
      this.translationHelper.getTranslationByKey('VS_LEAVE_TITLE'),
      this.translationHelper.getTranslationByKey('VS_LEAVE_MESSAGE'),
      'question',
      this.queryParamsConfig.pcolor,
      this.translationHelper.getTranslationByKey('VS_WEB_END_SESSION_CONFIRMATION_ACCEPT'),
      this.translationHelper.getTranslationByKey('VS_WEB_END_SESSION_CONFIRMATION_CANCEL'),)
      .then(async result => {
        if (result.isConfirmed) {
          this.notificationHelper.showLoading(this.translationHelper.getTranslationByKey('VS_WEB_END_SESSION_CONFIRMATION_REDIRECTING_TITLE'), this.translationHelper.getTranslationByKey('VS_WEB_END_SESSION_CONFIRMATION_REDIRECTING_DESCRIPTION'))
          await this.apiService.endSession(this.queryParamsConfig.apid);
          
          window.location.href = this.queryParamsConfig.red;
        }
      })
  }


}
