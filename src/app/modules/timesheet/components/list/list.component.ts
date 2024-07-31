import { Component } from '@angular/core';
import { OvertimeService } from '../../services/overtime.service';
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
  constructor(private readonly OvertimeService: OvertimeService) {}

  overtimeForm: Overtime[] = [];

  descriptionOptions: { id: number; desc: string; fee: number }[] = [
    { id: 1, desc: 'Interview Kandidat Bootcamp', fee: 30000 },
    { id: 2, desc: 'InstructorLed Basic', fee: 50000 },
    { id: 3, desc: 'InstructorLed Intermediate', fee: 50000 },
    { id: 4, desc: 'Overtime Kelas Karyawan', fee: 50000 },
    { id: 5, desc: 'Other', fee: 50000 },
  ];

  ngOnInit() {
    this.OvertimeService.List().subscribe((data) => {
      console.log('Data received in ngOnInit():', data);
      this.overtimeForm = data;
    });
  }

  remove(id: any) {
    this.OvertimeService.Delete(id).subscribe(() => {
      this.ngOnInit();
    });
  }

  getWorkDescription(id: number): string {
    const option = this.descriptionOptions.find((opt) => opt.id === id);
    return option ? option.desc : 'Unknown';
  }
}
