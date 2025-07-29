import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs/internal/Subject';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  todayDate: any = Date.now();
  encryptKey: string = 'whVF7bZMI8KAGER2VYzrVjlu4gSWs3Cn';
  doct_search_id: any;
  calendarAppointments: Subject<any> = new Subject();
  getpatientEvent: Subject<any> = new Subject();
  getpatientDetailEvent: Subject<any> = new Subject();
  sendpatientData: Subject<any> = new Subject();
  searchpatient_mobile: any;
  webAppointment: Subject<any> = new Subject();
  webAppointmentFilterData: any;
  CalData: Subject<any> = new Subject();
  updatePatientData: Subject<any> = new Subject();
  updatePatientFormData: any;
  queueManagent: Subject<any> = new Subject();
  loadCalendar: Subject<any> = new Subject();
  updateCalendarData: Subject<any> = new Subject();
  billItems = [];
  billItemsEmitter: Subject<any> = new Subject();
  openPopupEmitter: Subject<any> = new Subject();
  billSavedEmitter: Subject<any> = new Subject();

  bookings: any;

  constructor(private _router: Router) {}

  encrypt(data: string, key: string = this.encryptKey): string {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  bookWebAppointment(data: any) {
    this.webAppointment.next(data);
  }

  format(str: string, ...val: string[]) {
    for (let index = 0; index < val.length; index++) {
      str = str.replace(`{${index}}`, val[index]);
    }
    return str;
  }

  timeStampToTime(timestamp: any) {
    return new Date(timestamp * 1000);
  }

  validatetodayDate(apptTimestamp: any, patientStatus: any) {
    let value: boolean;
    if (patientStatus == true) {
      value = false;
    } else {
      if (
        new Date(apptTimestamp * 1000).getDate() ===
        new Date(this.todayDate).getDate()
      ) {
        value = true;
      } else {
        value = false;
      }
    }
    return value;
  }

  opencalendar(data: number) {
    this.loadCalendar.next(data);
  }

  openQueueMgmt() {
    // why only this fucntion has no parameter
    this.queueManagent.next(true);
  }

  upatePatient(data: {
    patientId: any;
    aptTime: any;
    status: any;
    doctName: any;
    apptId: any;
    appointmentStatus: any;
  }) {
    this.updatePatientData.next(data);
  }

  getPatientDetails(data: any) {
    this.getpatientEvent.next(data);
  }

  decrypt(data: string, key: string = this.encryptKey): string {
    //  console.log("decrypt data", data, key)
    if (!data) {
      // this._auth.logoutUser();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.clear();
      this._router.navigateByUrl('/login');
    }
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
  }

  sendcalendarData(appointments: any) {
    this.calendarAppointments.next(appointments);
  }

  saveBookings(bookings: any) {
    this.bookings = bookings;
    // console.log("this.bookings utisl", this.bookings)
  }

  convtDateHyphenFormate(date: any) {
    return new Date(date).toISOString().replace(/T.*/, '').split('-').join('-');
  }

  updateSelectedBillData() {
    this.billItemsEmitter.next(this.billItems);
  }

  
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform {
  transform(array: any[], field?: string): any[] {
    if (!Array.isArray(array)) return array;

    return array.sort((a, b) => {
      const valA = field ? a[field] : a;
      const valB = field ? b[field] : b;
      return valA.localeCompare(valB);
    });
  }
}
