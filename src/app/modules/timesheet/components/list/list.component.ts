import { Component, Input } from '@angular/core';
import { Overtime } from '../../model/timesheet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  @Input() overtimeForm: Overtime[] = [];
  @Input() delete!: (id: any) => void;

  descriptionOptions: { id: number; desc: string; fee: number }[] = [
    { id: 1, desc: 'Interview Kandidat Bootcamp', fee: 30000 },
    { id: 2, desc: 'InstructorLed Basic', fee: 50000 },
    { id: 3, desc: 'InstructorLed Intermediate', fee: 50000 },
    { id: 4, desc: 'Overtime Kelas Karyawan', fee: 50000 },
    { id: 5, desc: 'Other', fee: 50000 },
  ];

  getWorkDescription(id: number): string {
    const option = this.descriptionOptions.find((opt) => opt.id === id);
    return option ? option.desc : 'Unknown';
  }
}
