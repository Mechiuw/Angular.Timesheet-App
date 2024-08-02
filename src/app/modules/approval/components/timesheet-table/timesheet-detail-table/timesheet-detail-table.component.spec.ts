import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetDetailTableComponent } from './timesheet-detail-table.component';

describe('TimesheetDetailTableComponent', () => {
  let component: TimesheetDetailTableComponent;
  let fixture: ComponentFixture<TimesheetDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetDetailTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesheetDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
