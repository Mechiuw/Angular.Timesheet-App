export interface Timesheet {
  id?: any;
  userId: number;
  createdAt: Date;
  updateAt: Date;
  works: Overtime[];
}

export interface Overtime {
  id?: any;
  date: Date;
  startTime: Date;
  endTime: Date;
  description: string;
  total?: number;
}
