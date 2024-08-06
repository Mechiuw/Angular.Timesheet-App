import { Injectable } from '@angular/core';
import { IOvertimeUpdateService } from './iovertinmeUpdate.service';
import { BehaviorSubject, forkJoin, map, Observable, of } from 'rxjs';
import { Overtime, WorkOption } from '../model/timesheet';
import { TimesheetService } from './timesheet.service';

@Injectable({
  providedIn: 'root',
})
export class OvertimeUpdateService implements IOvertimeUpdateService {
  constructor(private readonly timesheetService: TimesheetService) {}

  today = new Date();
  works: Overtime[] = [];
  // descriptionOptions: WorkOption[] = [];
  workOptions$: Observable<WorkOption[]> = of([]);
  private totalPaySubject = new BehaviorSubject<number>(0);
  private sortedOvertime = new BehaviorSubject<Overtime[]>([]);

  List(): Observable<Overtime[]> {
    return this.sortedOvertime.asObservable();
  }

  GetWorks(works: Overtime[]): Observable<void> {
    const workTotalObservables = works.map((work) => {
      if (!work.id) {
        work.id = this.generateId();
      }
      return this.calculateWorkTotal(work).pipe(
        map((total) => {
          work.total = total;
          return work;
        })
      );
    });

    return forkJoin(workTotalObservables).pipe(
      map((updatedWorks) => {
        this.works = updatedWorks;
        this.calculateTotalPay();
        this.sortOvertimes();
      })
    );
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
      const dateComparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;

      const startComparison =
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      if (startComparison !== 0) return startComparison;

      return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
    });

    this.sortedOvertime.next(sort);
  }

  private generateId(): number {
    return this.works.length > 0
      ? Math.max(...this.works.map((work) => work.id || 0)) + 1
      : 1;
  }

  private calculateWorkTotal(work: Overtime): Observable<number> {
    return this.timesheetService.fethcWorkOptions().pipe(
      map((workOptions) => {
        const description = workOptions.find(
          (option) => option.id === work.workId
        );

        if (!description) return 0;

        const start = new Date(work.startTime).getTime();
        const end = new Date(work.endTime).getTime();
        const hours = Math.floor((end - start) / (1000 * 60 * 60));
        let total = hours * description.fee;

        if (
          description.description.toLowerCase().startsWith('interview') &&
          hours >= 2
        ) {
          total = hours * 50000;
        }

        return total;
      })
    );
  }

  getDetail(works: Overtime[]): Observable<Overtime[]> {
    const workTotalObservables = works.map((work) => {
      work.id = this.generateId();
      return this.calculateWorkTotal(work).pipe(
        map((total) => {
          work.total = total;
          return work;
        })
      );
    });

    return forkJoin(workTotalObservables).pipe(
      map((updatedWorks) => {
        this.works = updatedWorks;
        this.calculateTotalPay();
        this.sortOvertimes();
        return updatedWorks;
      })
    );
  }

  clearWorks(): void {
    this.works.splice(0, this.works.length);
    this.calculateTotalPay();
    this.sortOvertimes();
  }
}
