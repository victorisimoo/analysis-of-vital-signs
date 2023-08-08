import { environment } from 'src/environments/environment';
import { QueryParamsService } from './query-params.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()

export class TranslationService {

    private translations;
     
    constructor(private http: HttpClient,
        private queryParamsService: QueryParamsService) {
        this.translations = {} as any;
    }


    requestTranslations() {
        return new Promise(resolve => {
            this.http.post(environment.API_TRANSLATIONS, { resource: this.queryParamsService.getCorporateId(), type: 1 })
            .subscribe({
                next: (res:any) => {
                    res.translations.forEach((tr:any) => {
                        this.translations[tr.key] = tr.value;
                    });

                    resolve(true);
                },
                error: () => {
                    resolve(false);

                }
            })
        })
        
    }

   

    getTranslations() {
        return this.translations;
    }



}