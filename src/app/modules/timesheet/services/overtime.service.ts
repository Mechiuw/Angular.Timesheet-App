import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Overtime } from '../model/timesheet';

@Injectable({
  providedIn: 'root',
})
export class OvertimeService {
  constructor() {}

  today = new Date();
  works: Overtime[] = [];
  totalPay: number = 0;

  List(): Observable<Overtime[]> {
    return new Observable((observer) => {
      observer.next(this.works);
    });
  }

  Get(id: number): Observable<Overtime> {
    throw new Error('Method not implemented.');
  }

  Save(overtime: Overtime): Observable<void> {
    return new Observable((observer) => {
      const existingIndex = this.works.findIndex(
        (record) => record.id === overtime.id
      );
      if (existingIndex !== -1) {
        this.works[existingIndex] = overtime;
      } else {
        this.works.push(overtime);
      }
      observer.next();
      observer.complete();
    });
  }

  Delete(id: number): Observable<void> {
    return new Observable<void>((observer) => {
      try {
        this.works = this.works.filter((t) => t.id !== id);
        observer.next();
      } catch (error: any) {
        observer.error(`TodoService.Toggle.Erorr: ${error.message}`);
      }
    });
  }

  getMinDate(): Date {
    return new Date(
      this.today.getFullYear(),
      this.today.getMonth() - 2,
      this.today.getDate()
    );
  }

  getMaxDate(): Date {
    return new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - 1
    );
  }
}
