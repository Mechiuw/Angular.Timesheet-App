import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Overtime } from '../model/timesheet';
import { IOvertimeService } from './iovertime.service';

@Injectable({
  providedIn: 'root',
})
export class OvertimeService implements IOvertimeService {
  constructor() {}

  today = new Date();
  works: Overtime[] = [];
  private totalPaySubject = new BehaviorSubject<number>(0);
  private sortedOvertime = new BehaviorSubject<Overtime[]>([]);

  List(): Observable<Overtime[]> {
    return new Observable((observer) => {
      this.sortOvertimes();
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
        this.calculateTotalPay();
        this.sortOvertimes();
      }
      observer.next();
      observer.complete();
    });
  }

  Delete(id: number): Observable<void> {
    return new Observable<void>((observer) => {
      try {
        this.works = this.works.filter((t) => t.id !== id);
        this.calculateTotalPay();
        this.sortOvertimes();
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

  getTotalPay(): Observable<number> {
    return this.totalPaySubject.asObservable();
  }

  private calculateTotalPay(): void {
    const totalPay = this.works.reduce(
      (sum, curr) => sum + (curr.total || 0),
      0
    );
    this.totalPaySubject.next(totalPay);
  }

  private sortOvertimes(): void {
    const sort = this.works.sort((a, b) => {
      const dateComparison = a.date.getTime() - b.date.getTime();
      if (dateComparison !== 0) return dateComparison;

      const startComparison = a.startTime.getTime() - b.startTime.getTime();
      if (startComparison !== 0) return startComparison;

      return a.endTime.getTime() - b.endTime.getTime();
    });

    this.sortedOvertime.next(sort);
  }

  clearWorks(): void {
    this.works.splice(0, this.works.length);
    this.calculateTotalPay();
    this.sortOvertimes();
  }
}
