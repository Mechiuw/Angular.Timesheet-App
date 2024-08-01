export interface Timesheet {
  id?: any;
  userId: number;
  createdAt?: Date;
  updateAt?: Date;
  confirmedManagerBy: string;
  confirmedBenefitBy: string;
  works: Overtime[];
  status: Status;
}

export interface Overtime {
  id?: any;
  date: Date;
  startTime: Date;
  endTime: Date;
  workID: number;
  total: number;
}

const enum Status {
  Pending = 'Pending',
  OnProgress = 'OnProgress',
  Approved = 'Approved',
  Rejected = 'Rejected',
}
