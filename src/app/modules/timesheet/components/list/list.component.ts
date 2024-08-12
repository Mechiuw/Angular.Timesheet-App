import { Component, Input, OnInit } from '@angular/core';
import { Overtime, WorkOption } from '../../model/timesheet';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { first, Observable, of } from 'rxjs';
import { color } from 'chart.js/helpers';
import {TooltipModule} from "primeng/tooltip";
import {RupiahFormatPipe} from "../../../../shared/pipes/rupiah-format.pipe";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, TableModule, TooltipModule, RupiahFormatPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  @Input() overtimeForm: Overtime[] = [];
  @Input() delete!: (id: any) => void;

  private workDescriptions: { [id: string]: string } = {};
  @Input() workOptions$: Observable<WorkOption[]> = of([]);

  ngOnInit(): void {
    this.workOptions$.subscribe((options) => {
      options.forEach((option) => {
        this.workDescriptions[option.id] = option.description;
      });
    });
  }

  getWorkDescription(id: string): string {
    return this.workDescriptions[id] || 'Unknown';
  }

  protected readonly color = color;
  protected readonly first = first;
}
