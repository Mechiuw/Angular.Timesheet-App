import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-list-timesheet',
  standalone: true,
  imports: [TableComponent, TableModule, CommonModule],
  templateUrl: './list-timesheet.component.html',
  styleUrl: './list-timesheet.component.scss',
})
export class ListTimesheetComponent {
  prodcut: any[] = [
    {
      id: 1,
      userId: 1,
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
          endTime: new Date('2024-07-06T02:00:00.000Z'),
          workID: 2,
        },
      ],
      status: 'pending',
    },
  ];
}
