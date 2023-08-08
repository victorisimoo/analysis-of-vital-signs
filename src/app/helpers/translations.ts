import { TranslationService } from './../services/translations.service';
import { Injectable } from "@angular/core";

@Injectable()

export class TranslationsHelper {

    constructor(private translationService: TranslationService) {

    }


    getTranslationByKey(key:string) {
        const translations = this.translationService.getTranslations();
        return translations[key]?translations[key]:'STRING NOT DEFINED';
    }


    checkIfNaN(value: any) {
        //NaN is the only JavaScript value that is treated as unequal to itself
        const result = isNaN(value) ? this.getTranslationByKey('SV_FINAL_RESULT_EMPTY') : value;
        return result;
    }


    getStressLevelTextValue(value: number) {
        switch (value) {
            case 1:
                return this.getTranslationByKey('VS_STRESS_LEVEL_LOW')
            case 2:
                return this.getTranslationByKey('VS_STRESS_LEVEL_NORMAL')
            case 3:
                return this.getTranslationByKey('VS_STRESS_LEVEL_MILD')
            case 4:
                return this.getTranslationByKey('VS_STRESS_LEVEL_HIGH')
            case 5:
                return this.getTranslationByKey('VS_STRESS_LEVEL_EXTREME')
            default:
                return this.getTranslationByKey('SV_FINAL_RESULT_EMPTY')
        }
    }

    getWellnessLevelTextValue(value: number) {
        switch (value) {
            case 1:
                return this.getTranslationByKey('VS_WELLNESS_LEVEL_LOW')
            case 2:
                return this.getTranslationByKey('VS_WELLNESS_LEVEL_MEDIUM')
            case 3:
                return this.getTranslationByKey('VS_WELLNESS_LEVEL_HIGH')
            default:
                return this.getTranslationByKey('SV_FINAL_RESULT_EMPTY')
        }
    }
}