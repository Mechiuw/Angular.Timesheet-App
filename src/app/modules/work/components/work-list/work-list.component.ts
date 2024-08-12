import {Component, OnInit, ViewChild} from "@angular/core";
import { TagModule } from "primeng/tag";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PagedResponse } from "../../../../core/models/api.model";
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { TitleHeaderComponent } from '../../../../shared/components/title-header/title-header.component';
import { WorkService } from '../../services/work.service';
import { Work } from '../../models/work.model';
import { RupiahFormatPipe } from '../../../../shared/pipes/rupiah-format.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-work-list',
  standalone: true,
  imports: [
    RouterLink,
    ToastModule,
    ConfirmPopupModule,
    RupiahFormatPipe,
    SkeletonModule,
    InputTextModule,
    TagModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    DropdownModule,
    TitleHeaderComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './work-list.component.html',
  styleUrl: './work-list.component.scss',
})
export class WorkListComponent implements OnInit {
  constructor(
    private readonly workService: WorkService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  @ViewChild('dt1') dt: Table | undefined;

  searchValue: string = '';

  works: Work[] = [];
  first: number | undefined = 0;
  totalRecords: number = 0;
  page: number = 1;
  isLoading: boolean = true;
  rowsOption: number[] = [5, 10, 50];

  clear(table: Table) {
    this.searchValue = '';
    table.clear();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  loadWorks($event: LazyLoadEvent) {
    let rows = $event.rows;
    this.page = Math.ceil(($event?.first ?? 0) / ($event?.rows ?? 1)) + 1;
    this.isLoading = true;

    if (this.searchValue != '') {
      this.workService.GetByName(this.searchValue || '').subscribe({
        next: (response: PagedResponse<Work[]>) => {
          this.totalRecords = response.paging.totalRows;
          rows = response.paging.rowsPerPage;
          this.works = response.data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false
        },
      });
    } else {
      this.workService.List(rows ?? 1, this.page).subscribe({
        next: (response: PagedResponse<Work[]>) => {
          this.totalRecords = response.paging.totalRows;
          rows = response.paging.rowsPerPage;
          this.works = response.data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false
        },
      });
    }
  }
  onDelete(id: string) {
    this.isLoading = true;
    this.workService.Delete(id).subscribe(() =>
      this.workService.List().subscribe({
        next: (response: PagedResponse<Work[]>) => {
          this.totalRecords = response.paging.totalRows;
          this.works = response.data;
          this.isLoading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error Occurred',
            detail: `Failed to delete work`,
          });
        },
      })
    );
  }

  confirmDelete(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.onDelete(id);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }
  ngOnInit(): void {
    // Initial load
    this.workService.updateWorks();

    // Subscribe to the observable to get real-time updates
    this.workService.works$.subscribe((works) => {
      this.works = works;
    });
  }
}
