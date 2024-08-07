export interface Timesheet {
  id?: any;
  userId?: number;
  createdAt?: Date;
  updateAt?: Date;
  confirmedManagerBy?: string;
  confirmedBenefitBy?: string;
  timeSheetDetails: Overtime[];
  status?: string;
}

export interface Overtime {
  id?: any;
  date: Date;
  startTime: Date;
  endTime: Date;
  workId: string;
  total?: number;
  description?: string;
  subTotal?: number;
}
export interface TimesheetResponse {
  id?: any;
  userId?: number;
  createdAt?: string;
  updateAt?: string;
  confirmedManagerBy?: string;
  confirmedBenefitBy?: string;
  timeSheetDetails: Overtime[];
  total?: number;
}

export interface OvertimeResponse {
  id?: any;
  date: string;
  startTime: string;
  endTime: string;
  workId: string;
  total?: number;
  subTotal: number;
}

export interface WorkOption {
  id: string;
  description: string;
  fee: number;
}

export enum Status {
  Created = 'Created',
  Pending = 'Pending',
  OnProgress = 'OnProgress',
  Approved = 'Approved',
  Rejected = 'Rejected',
}
