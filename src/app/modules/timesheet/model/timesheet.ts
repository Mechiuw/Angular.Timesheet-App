export interface Timesheet {
  id?: any;
  userId?: number;
  createdAt?: Date;
  updateAt?: Date;
  confirmedManagerBy?: string;
  confirmedBenefitBy?: string;
  works: Overtime[];
  status?: Status;
}

export interface Overtime {
  id?: any;
  date: Date;
  startTime: Date;
  endTime: Date;
  workID: string;
  total?: number;
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
