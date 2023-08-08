import { Injectable } from '@angular/core';

import { qParams } from '../classes/queryParams.class';




@Injectable({
  providedIn: 'root'
})
export class QueryParamsService {

  private queryParams: qParams;

  constructor() {
    this.queryParams = new qParams();
    this.initQueryParams();

  }

  

  private initQueryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const configuration: any = urlParams.get('conf');
    this.queryParams = JSON.parse(decodeURIComponent(configuration));

  }


  public getQueryParams(): qParams {
    return JSON.parse(JSON.stringify(this.queryParams));
  }

  public getBearerToken(): string {
    return this.queryParams.tok;
  }

  public getCorporateId(): string {
    return this.queryParams.cord;
  }

}
