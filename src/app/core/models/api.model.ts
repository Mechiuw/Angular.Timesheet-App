export interface Paging {
    paging: number
    rowsPerPage: number
    totalRows: number
    totalPages: number
  }
  
  export interface ResponseStatus {
    code: number
    description: string
  }
  
  export interface ResponseEntity<T> {
    status: ResponseStatus
    data: T
  }
  
  export class SingleResponse<T> implements ResponseEntity<T> {
    status!: ResponseStatus
    data!: T
  }
  
  export class PagedResponse<T> implements ResponseEntity<T> {
    status!: ResponseStatus
    data!: T
    paging!: Paging
  }