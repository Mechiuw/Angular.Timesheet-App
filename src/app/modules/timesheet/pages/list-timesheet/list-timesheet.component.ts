import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Status, Timesheet } from '../../model/timesheet';

@Component({
  selector: 'app-list-timesheet',
  standalone: true,
  imports: [TableComponent, TableModule, CommonModule],
  templateUrl: './list-timesheet.component.html',
  styleUrl: './list-timesheet.component.scss',
})
export class ListTimesheetComponent {
  indexPage: number = 0;

  timesheets: Timesheet[] = [
    {
      id: 1,
      userId: 1,
      createdAt: new Date('2024-07-03T17:00:00.000Z'),
      confirmedManagerBy: 'ManagerName',
      confirmedBenefitBy: 'BenefitName',
      works: [
        {
          date: new Date('2024-07-03T17:00:00.000Z'),
          startTime: new Date('2024-07-04T02:00:00.000Z'),
          endTime: new Date('2024-07-04T05:00:00.000Z'),
          workID: 3,
        },
        {
          date: new Date('2024-07-05T17:00:00.000Z'),
          startTime: new Date('2024-07-06T02:00:00.000Z'),
          endTime: new Date('2024-07-06T03:00:00.000Z'),
          workID: 2,
        },
      ],
      status: Status.Pending,
    },
    {
      userId: 2,
      createdAt: new Date('2024-08-02T08:06:19.799Z'),
      confirmedManagerBy: 'ManagerName',
      confirmedBenefitBy: 'BenefitName',
      works: [
        {
          id: 1722585911431,
          date: new Date('2024-07-08T17:00:00.000Z'),
          startTime: new Date('2024-07-09T02:00:00.000Z'),
          endTime: new Date('2024-07-09T03:00:00.000Z'),
          workID: 3,
        },
        {
          id: 1722585968767,
          date: new Date('2024-07-09T17:00:00.000Z'),
          startTime: new Date('2024-07-10T03:00:00.000Z'),
          endTime: new Date('2024-07-10T05:00:00.000Z'),
          workID: 1,
        },
        {
          id: 1722585934135,
          date: new Date('2024-07-10T17:00:00.000Z'),
          startTime: new Date('2024-07-11T03:00:00.000Z'),
          endTime: new Date('2024-07-11T05:00:00.000Z'),
          workID: 1,
        },
      ],
      status: Status.Pending,
    },
  ];
}
