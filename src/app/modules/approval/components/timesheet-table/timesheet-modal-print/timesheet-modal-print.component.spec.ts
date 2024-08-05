import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetModalPrintComponent } from './timesheet-modal-print.component';

describe('TimesheetModalPrintComponent', () => {
  let component: TimesheetModalPrintComponent;
  let fixture: ComponentFixture<TimesheetModalPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetModalPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesheetModalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
