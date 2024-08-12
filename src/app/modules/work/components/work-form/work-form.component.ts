import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WorkService } from '../../services/work.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-work-description-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ToastModule,
  ],
  templateUrl: './work-form.component.html',
  styleUrl: './work-form.component.scss',
  providers: [MessageService],
})
export class WorkFormComponent implements OnInit {
  postWorkForm: FormGroup;
  isEdit: boolean = false;
  workId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private workService: WorkService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.postWorkForm = this.fb.group({
      description: ['', Validators.required],
      fee: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.workId = id;
        this.Get(id);
      } else {
        this.isEdit = false;
        this.workId = null;
      }
    });
  }

  Get(id: string): void {
    this.workService.Get(id).subscribe((work) => {
      this.postWorkForm.patchValue({
        // id: work.id,
        description: work.data.description,
        fee: work.data.fee,
        createdAt: work.data.createdAt ? new Date(work.data.createdAt) : null,
        updatedAt: work.data.updatedAt ? new Date(work.data.updatedAt) : null,
      });
    });
  }

  saveWork(): void {
    if (this.postWorkForm.valid) {
      const formData = this.postWorkForm.value;
      let calculatedFee = Number(formData.fee) || 0;

      if (formData.description.toLowerCase() === 'interview') {
        calculatedFee -= calculatedFee * 0.4;
      }

      formData.fee = calculatedFee;

      if (this.isEdit) {
        if (this.workId !== null) {
          const id = this.workId.toString();
          this.workService.Update({ ...this.postWorkForm.value, id }).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Work has been successfully updated`,
              });
              this.router.navigate(['/works']);
            },
            (error) => {
              return error;
            }
          );
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error Occurred',
            detail: `Invalid work ID for update`,
          });
        }
      } else {
        this.workService.Add(formData).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Work has been successfully added`,
            });
            this.router.navigate(['/works']);
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error Occurred',
              detail: `Error creating work: ${err}`,
            });
          }
        );
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Occurred',
        detail: 'Form is invalid. Please fill out all required fields',
      });
    }
  }

  cancel(): void {
    this.postWorkForm.reset();
    this.router.navigate(['/works']);
  }
}
