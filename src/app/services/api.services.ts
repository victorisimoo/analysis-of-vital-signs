import { QueryParamsService } from './query-params.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VitalSigns } from '@binah/web-sdk/dist/common/types';

@Injectable()

export class ApiService {
    private token: string;
    constructor(private http: HttpClient,
        private queryParamsService: QueryParamsService) {
        this.token = this.queryParamsService.getBearerToken();
    }


    getToken() {
        this.http.get(`${environment.API_BASE_URL}/`)
            .subscribe({
                next: (res) => {
                    this.token = <string>res;

                },
                error: (err) => {

                }
            })
    }

    changeSessionStatus(medicalAppointment: string, status: string) {
        this.http.post(`${environment.API_BASE_URL}${environment.BINAH_API}/change-status-analyse`,
            {
                medicalAppoimentId: medicalAppointment,
                status: status
            })
            .subscribe({
                next: (res) => {

                },
                error: (err) => {

                }
            })
    }


    sendVitals(medicalAppointmentId: string, vitalSigns: VitalSigns) {
        return new Promise(resolve => {
            this.http.post(`${environment.API_BASE_URL}${environment.BINAH_API}/vital-sings-report`, { medicalAppointmentId, vitalSigns })
                .subscribe({
                    next: (res) => {

                        resolve(true);
                    },
                    error: (err) => {

                        resolve(false);
                    }
                })
        })

    }

    endSession(medicalAppointmentId: string) {
        return new Promise(resolve => {
            this.http.post(`${environment.API_BASE_URL}${environment.DRONLINE_API}/end-medical-appointment`,
                { medicalAppointmentId },
                { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` } })
                .subscribe({
                    next: (res) => {

                        resolve(true);
                    },
                    error: (err) => {

                        resolve(false);
                    }
                })
        })
    }




}