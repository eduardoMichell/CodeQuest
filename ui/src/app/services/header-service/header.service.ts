import { Injectable } from '@angular/core';
import { HeaderData } from "./header-data.model";
import { BehaviorSubject, Observable } from "rxjs";
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  _headerData = new BehaviorSubject<HeaderData>({
    title: 'Game',
    icon: '',
    routeUrl: ''
  })

  constructor() {
  }

  get headerData(): HeaderData {
    return this._headerData.value
  }

  set headerData(headerData: HeaderData) {
    this._headerData.next(headerData)
  }
 


}
