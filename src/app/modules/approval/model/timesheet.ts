export interface DetailTimesheetEntry {
    workId: string;    
    fee: number;
    startTime: Date; 
    endTime: Date;   
    date: string;      
  }
  
  export interface TimesheetEntry {
    id: string;    
    user: string
    status: string;
    totalFee: number;
    createdAt: Date; 
    updatedAt: Date; 
    deletedAt?: Date; 
    manager?: string;
    benefit?: string;
    detail: DetailTimesheetEntry[]; 
  }
  