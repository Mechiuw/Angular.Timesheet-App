import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Work } from '../../models/work.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkService } from '../../services/work.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { WorkListComponent } from '../work-list/work-list.component';

@Component({
  selector: 'app-work-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatInputModule, MatButtonModule],
  templateUrl: './work-form.component.html',
  styleUrl: './work-form.component.scss'
})
export class WorkFormComponent implements OnInit{
  postWorkForm: FormGroup;
  isEdit: boolean = false;
  workId: string | null = null;
  isModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private workService: WorkService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService
  ) {
    this.postWorkForm = this.fb.group({
      description: ['', Validators.required],
      fee: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
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
      });
    });
  }

  saveWork(): void {
    if (this.postWorkForm.valid) {
      const formData = this.postWorkForm.value;
      let calculatedFee = Number(formData.fee) || 0;

      if (formData.description.toLowerCase() === 'interview') {
        calculatedFee -= calculatedFee * 0.40;
      }

      formData.fee = calculatedFee;

      console.log('Form Data Before Posting:', formData);

      if (this.isEdit) {
        if (this.workId !== null) {
          const id = this.workId.toString();
          this.workService.Update(this.postWorkForm.value).subscribe(
            () => {
              this.toaster.success("Work has been successfully updated", "Success")
              this.router.navigate(['/layout']);
            },
            error => {
              console.error('Error updating work:', error);
            }
          );
        } else {
          console.error('Invalid work ID for update');
        }
      } else {
        this.workService.Add(formData).subscribe(
          (res) => {
            console.log('Response from Backend:', res);
            this.toaster.success("Work has been successfully added", "Success")
            this.router.navigate(['/layout']);
          },
          (err) => {
            console.error('Error creating work:', err);
          }
        );
      }
    } else {
      this.toaster.error('Form is invalid. Please fill out all required fields.', 'Error');
      console.error('Form is invalid');
    }
  }

  cancel(): void {
    this.router.navigate(['/layout']);
  }
}
