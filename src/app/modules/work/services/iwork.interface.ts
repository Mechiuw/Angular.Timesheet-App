import { Observable } from "rxjs";
import { PagedResponse, SingleResponse } from "../../../core/models/api.model";
import { Work } from "../models/work.model";

export interface IWorkService {
    List(rows?: number, page?: number): Observable<PagedResponse<Work[]>>;
    Get(id: number): Observable<SingleResponse<Work>>;
    Add(work: Work): Observable<SingleResponse<Work>>;
    Update(work: Work): Observable<SingleResponse<Work>>;
    Delete(id: string): Observable<void>;
    GetByName(name: string): Observable<PagedResponse<Work[]>>;
}