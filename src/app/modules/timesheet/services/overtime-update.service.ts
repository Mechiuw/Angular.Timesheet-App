import { Injectable } from '@angular/core';
import { IOvertimeUpdateService } from './iovertinmeUpdate.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Overtime, WorkOption } from '../model/timesheet';
import { TimesheetService } from './timesheet.service';

@Injectable({
  providedIn: 'root',
})
export class OvertimeUpdateService implements IOvertimeUpdateService {
  constructor(private readonly timesheetService: TimesheetService) {}

  today = new Date();
  works: Overtime[] = [];
  descriptionOptions: WorkOption[] = [];
  private totalPaySubject = new BehaviorSubject<number>(0);
  private sortedOvertime = new BehaviorSubject<Overtime[]>([]);

  List(): Observable<Overtime[]> {
    return this.sortedOvertime.asObservable();
  }

  GetWorks(works: Overtime[]): Observable<void> {
    return new Observable((observer) => {
      this.works.splice(0, this.works.length);
      works.forEach((work) => {
        work.id = this.generateId();
        work.total = this.calculateWorkTotal(work);
        this.works.push(work);
      });

      this.calculateTotalPay();
      this.sortOvertimes();
      observer.next();
      observer.complete();
    });
  }

  Update(overtime: Overtime): Observable<void> {
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

  private generateId(): number {
    return this.works.length > 0
      ? Math.max(...this.works.map((work) => work.id || 0)) + 1
      : 1;
  }

  private calculateWorkTotal(work: Overtime): number {
    this.descriptionOptions = this.timesheetService.GetWorkOptions();
    const description = this.descriptionOptions.find(
      (option) => option.id === work.workID
    );
    if (!description) return 0;

    const start = work.startTime.getTime();
    const end = work.endTime.getTime();
    const hours = Math.floor((end - start) / (1000 * 60 * 60));
    let total = hours * description.fee;

    if (description.id === 1 && hours >= 2) {
      total = hours * 50000;
    }

    return total;
  }

  getDetail(works: Overtime[]): Overtime[] {
    const data: Overtime[] = [];
    works.forEach((work) => {
      work.id = this.generateId();
      work.total = this.calculateWorkTotal(work);
      data.push(work);
    });

    this.calculateTotalPay();
    this.sortOvertimes();
    return data;
  }

  clearWorks(): void {
    this.works.splice(0, this.works.length);
    this.calculateTotalPay();
    this.sortOvertimes();
  }
}
