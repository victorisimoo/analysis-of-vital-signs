import { QueryParamsService } from './../../services/query-params.service';
import { ApiService } from './../../services/api.services';

import { FacialAnalysisMeasurementComponent } from './../facial-analysis-measurement/facial-analysis-measurement.component';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MediaDevicesHelper } from 'src/app/helpers/mediaDevices';
import monitor,
{
  AlertData,
  DeviceOrientation,
  HealthMonitorSession,
  HealthMonitorReport,
  HealthMonitorMessage,
  SessionState,
  VitalSigns,
  VitalSignsResults,
  HealthMonitorStressLevel,
} from '@binah/web-sdk';
import { NotificationHelper } from 'src/app/helpers/notifications';
import { TranslationsHelper } from 'src/app/helpers/translations';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-facial-analysis',
  templateUrl: './facial-analysis.component.html',
  styleUrls: ['./facial-analysis.component.scss']
})
export class FacialAnalysisComponent implements OnInit, OnDestroy {
  @ViewChild('monitorVideo') monitorVideo!: ElementRef;
  @ViewChild('notificationMessage') notificationMessage!: ElementRef;
  @ViewChild('sessionTimer') sessionTimer!: ElementRef;
  @ViewChild('scan-action-btns') scanActionBtns!: ElementRef;

  @ViewChild('heartBeatMeasurement') heartBeatMeasurement!: FacialAnalysisMeasurementComponent;
  @ViewChild('breathingRateMeasurement') breathingRateMeasurement!: FacialAnalysisMeasurementComponent;
  //@ViewChild('snddMeasurement') snddMeasurement!: FacialAnalysisMeasurementComponent;
  @ViewChild('stressLevelMeasurement') stressLevelMeasurement!: FacialAnalysisMeasurementComponent;
  @ViewChild('bloodPressure') bloodPressure!: FacialAnalysisMeasurementComponent;
  @ViewChild('wellnessLevel') wellnessLevel!: FacialAnalysisMeasurementComponent;
  @ViewChild('oxygenSaturation') oxygenSaturation!: FacialAnalysisMeasurementComponent;

  medicalAppointmentId: any;
  timerInterval: any;
  healthMonitor: HealthMonitorSession;
  license: any;
  selectedCamera: number;
  userProfileId: any;
  sessionDuration: number;

  cameras: any[];

  //Flags
  canSdkInit: boolean;
  isScanning: boolean;
  cameraStatus: string;

  lastStateChange: number;
  corporationColor: string;
  corporationFavicon: string;

  constructor(private renderer: Renderer2,
    public mediaDevicesHelper: MediaDevicesHelper,
    private apiService: ApiService,
    private queryParamsService: QueryParamsService,
    private notificationHelper: NotificationHelper,
    public translationsHelper: TranslationsHelper) {

    this.healthMonitor = {} as any;
    this.selectedCamera = 0;
    this.lastStateChange = 0;
    this.sessionDuration = 120;
    this.userProfileId = "";
    this.canSdkInit = false;
    this.isScanning = false;
    this.corporationColor = "#000000";
    this.corporationFavicon = "";
    this.cameraStatus = "LOADING";
    this.cameras = [];
  }

  ngOnInit(): void {

    const params = this.queryParamsService.getQueryParams();

    // Get license url param
    // Decode uri and decode base64 param
    this.license = decodeURIComponent(atob(params.mz));
    this.medicalAppointmentId = params.apid;
    this.corporationColor = params.pcolor;
    this.initializeSdk();
  }

  initializeSdk() {
    //1. Initialize HealthMonitor
    monitor.initialize({ licenseKey: this.license })
      .then(value => {
        console.log("Se ha inicializado el HealtMonitor");

        this.createMonitoringSession();
      })
      .catch(error => {
        console.log("Ha ocurrido un error inicializando", error);
      });
  }

  //2. Create HealthMonitorSession
  async createMonitoringSession() {

    await this.mediaDevicesHelper.getMediaDevices();

    if (!this.mediaDevicesHelper.doesUserHaveCamera()) {
      this.cameraStatus = "NO_CAMERAS";
      throw new Error("Parece que no tienes cámaras");
    }

    const hasPermissions = await this.mediaDevicesHelper.requestCameraPermissions()
    if (!hasPermissions) {
      this.cameraStatus = "NO_PERMISSION";
      throw new Error("Parece que la cámara no tiene permisos");

    }

    this.cameraStatus = "";
    await this.mediaDevicesHelper.getMediaDevices();
    this.cameras = this.mediaDevicesHelper.cameras;
    this.canSdkInit = true;
    const camera = this.mediaDevicesHelper.cameras[this.selectedCamera];

    setTimeout(async () => {
      try {
        const options = {
          input: this.monitorVideo?.nativeElement,
          cameraDeviceId: camera.deviceId,
          processingTime: this.sessionDuration,
          orientation: DeviceOrientation.PORTRAIT,
          onError: (error: AlertData) => {
            //!TODO Implementación de log backend
            this.notificationHelper.showModal('Error', this.translationsHelper.getTranslationByKey('VS_AN_ERROR_HAS_OCCURRED'), 'warning', this.translationsHelper.getTranslationByKey('VS_AGREED'));
            console.log("Ha ocurrido un error on error", error);
          },
          //5. Face detection callback onFaceDetected
          onFaceDetected: (detected: Boolean) => {

            if (!detected && this.healthMonitor.getState() < 3) {
              this.setErrorMessage(this.translationsHelper.getTranslationByKey('VS_NO_FACE'));
            } else {
              this.clearErrorMessage();
            }
          },
          //6. Recieve measurements on OnMessage callback method
          onMessage: (messageType: HealthMonitorMessage, message: number | HealthMonitorStressLevel | HealthMonitorReport | VitalSignsResults) => {

            if (messageType === 100) {
              this.notificationHelper.showModal(this.translationsHelper.getTranslationByKey('VS_FINAL_RESULTS'), this.translationsHelper.getTranslationByKey('VS_WEB_ANALYSIS_FINISHED_MODAL_DESCRIPTION'), 'success', this.translationsHelper.getTranslationByKey('VS_AGREED'));
              this.clearErrorMessage();

              this.printFinalReport(<VitalSigns>message);
              this.apiService.sendVitals(this.medicalAppointmentId, <VitalSigns>message);

            } else {
              this.setMeasurement(messageType, <HealthMonitorReport>message);
            }
          },
          onStateChange: (state: SessionState) => {
            if (state === 2) {
              this.isScanning = true;
            }

            if (state === 3) {
              this.stopMonitoring();
            }
            if (state === 3 || state === 4) {
              this.isScanning = false;
              clearInterval(this.timerInterval);
              this.setMeasurementsLoadingState(false);
            }

            // ISSUE: Whenever a session stops the state changes to 3 (STOPPING) and right after the state 1 (INIT) is emitted
            if (this.lastStateChange === 0 || (Date.now() - this.lastStateChange) > 700) {
              this.apiService.changeSessionStatus(this.medicalAppointmentId, state.toString());
              this.lastStateChange = Date.now();
            }
          }
        };
        this.healthMonitor = await monitor.createFaceSession(options);
      } catch (error) {
        this.notificationHelper.showModal('Error', this.translationsHelper.getTranslationByKey('VS_AN_ERROR_HAS_OCCURRED'), 'warning', this.translationsHelper.getTranslationByKey('VS_AGREED'));
        console.log(error);
      }
    }, 1000)
  }

  //4. Start HealthMonitorSession
  startMonitoring() {
    try {
      this.healthMonitor.start();
      this.setMeasurementsLoadingState(true);
      this.initializeTimer();  
    } catch (error) {
      console.log(error);
    }
    
  }

  stopMonitoring() {
    this.isScanning = false;
    this.healthMonitor.stop();
  }

  terminateMonitoring() {
    this.healthMonitor.terminate();
  }

  initializeTimer() {
    let sessionTime: number = 1;
    this.timerInterval = setInterval(() => {
      if (sessionTime <= this.sessionDuration) {
        const minutes: string = sessionTime / 60 >= 1 ? Math.trunc(sessionTime / 60).toString() : "0";
        let seconds: string = (sessionTime % 60).toString();

        seconds = seconds.toString().length === 1 ? `0${seconds.toString()}` : seconds;
        this.renderer.setProperty(this.sessionTimer.nativeElement, 'textContent', `${minutes}:${seconds}`);
        sessionTime++;

      }

    }, 1000)
  }

  changeCamera(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedCamera = Number(target.value);
    this.createMonitoringSession();
  }

  setErrorMessage(message: string) {
    this.renderer.setProperty(this.notificationMessage.nativeElement, 'textContent', message)
    this.renderer.addClass(this.notificationMessage.nativeElement, 'notification-error');
  }

  clearErrorMessage() {
    this.renderer.setProperty(this.notificationMessage.nativeElement, 'textContent', "")
    this.renderer.removeClass(this.notificationMessage.nativeElement, 'notification-error');
  }

  /**
   * Sets the value and state of a FacialAnalysisMeasurementComponent
   * @param type Measurement type
   * @param value Measurement value
   */
  setMeasurement(type: number, value: HealthMonitorReport | number | HealthMonitorStressLevel) {
    switch (type) {
      case 1: //Heart beat measurement
        this.heartBeatMeasurement.value = Number(value);
        this.heartBeatMeasurement.isLoading = false;
        break;
      case 3:  // Breathing rate
        this.breathingRateMeasurement.value = Number(value);
        this.breathingRateMeasurement.isLoading = false;
        break;

    }
  }

  /**
   * Prints final Monitor Report
   * @param report HealthMonitorReport
   */
  printFinalReport(report: VitalSigns) {
    this.heartBeatMeasurement.value = this.translationsHelper.checkIfNaN(report.heartRate);
    this.breathingRateMeasurement.value = this.translationsHelper.checkIfNaN(report.breathingRate);
    //this.snddMeasurement.value = this.translationsHelper.checkIfNaN(report.sdnn);
    this.stressLevelMeasurement.value = this.translationsHelper.getStressLevelTextValue(report.stressLevel);
    if(isNaN(report.bloodPressure.systolic) || isNaN(report.bloodPressure.diastolic)){
      this.bloodPressure.value = this.translationsHelper.checkIfNaN(report.bloodPressure.systolic);
    }else {
      this.bloodPressure.value = `${this.translationsHelper.checkIfNaN(report.bloodPressure.systolic)} / ${this.translationsHelper.checkIfNaN(report.bloodPressure.diastolic)}`;
    }
    this.wellnessLevel.value = this.translationsHelper.getWellnessLevelTextValue(report.wellnessLevel);
    this.oxygenSaturation.value = this.translationsHelper.checkIfNaN(report.oxygenSaturation);
  }

  /**
   * Sets loading state to all FacialAnalysisMeasurementComponents at once
   * @param state Boolean
   */
  setMeasurementsLoadingState(state: boolean) {
    this.heartBeatMeasurement.isLoading = state;
    this.breathingRateMeasurement.isLoading = state;
    //this.snddMeasurement.isLoading = state;
    this.stressLevelMeasurement.isLoading = state;
    this.bloodPressure.isLoading = state;
    this.oxygenSaturation.isLoading = state;
    this.wellnessLevel.isLoading = state;
  }

  ngOnDestroy(): void {
    this.terminateMonitoring();
  }
}
