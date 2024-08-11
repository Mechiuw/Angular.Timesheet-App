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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-work-description-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
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
  isModalOpen = false;
  isLoadingSave: boolean = false;

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
    this.isLoadingSave = true;

    if (this.postWorkForm.valid) {
      const formData = this.postWorkForm.value;
      let calculatedFee = Number(formData.fee) || 0;

      if (formData.description.toLowerCase() === 'interview') {
        calculatedFee -= calculatedFee * 0.4;
      }

      formData.fee = calculatedFee;

      // console.log('Form Data Before Posting:', formData);

      if (this.isEdit) {
        if (this.workId !== null) {
          const id = this.workId.toString();
          this.workService.Update({ ...this.postWorkForm.value, id }).subscribe(
            () => {
              // Notify success
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Work updated successfully',
                life: 3000,
              });

              // // Navigate back
              // this.router.navigate(['/works']);

              // Disable loading
              this.isLoadingSave = false;

              // Data load
              this.workService.updateWorks();
            },
            (error) => {
              // console.error('Error updating work:', error);

              // notify error
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error creating work: ' + error.error.data,
                life: 3000,
              });

              // Disable loading
              this.isLoadingSave = false;
            }
          );
        } else {
          console.error('Invalid work ID for update');
        }
      } else {
        this.workService.Add(formData).subscribe(
          (res) => {
            // Notify success
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Work created successfully',
              life: 3000,
            });

            // Disable loading
            this.isLoadingSave = false;

            // Data load
            this.workService.updateWorks();
          },
          (err) => {
            // console.error('Error creating work:', err);

            // notify error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error creating work: ' + err.error.data,
              life: 3000,
            });

            // Disable loading
            this.isLoadingSave = false;
          }
        );
      }
    } else {
      // console.error('Form is invalid');

      // notify error
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error creating work',
        life: 3000,
      });

      // Disable loading
      this.isLoadingSave = false;
    }
  }

  cancel(): void {
    this.postWorkForm.reset();
    this.router.navigate(['/works']);
  }
}
