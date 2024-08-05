// Model for TimeSheetDetail
export interface TimeSheetDetail {
  id: string;
  date: string; // ISO 8601 date string
  startTime: string; // ISO 8601 date-time string
  endTime: string; // ISO 8601 date-time string
  workId: string;
  description: string;
  subTotal: number;
}

// Model for User
export interface User {
  id: string;
  name: string;
  email: string;
  signatureUrl?: string; // Optional field
}

// Model for Confirmed By
export interface ConfirmedBy {
  userId: string;
  name: string;
  email: string;
  signatureUrl?: string; // Optional field
}

// Model for TimeSheet
export interface Timesheet {
  id: string;
  createdAt: string; // ISO 8601 date-time string
  updatedAt: string; // ISO 8601 date-time string
  statusByManager: string;
  statusByBenefit: string;
  confirmedManagerBy: ConfirmedBy;
  confirmedBenefitBy: ConfirmedBy;
  user: User;
  timeSheetDetails: TimeSheetDetail[];
  total: number;
}