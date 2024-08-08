import { Observable } from "rxjs";
import { PagedResponse, SingleResponse } from "../../../core/models/api.model";
import { Work } from "../models/work.model";

export interface IWorkService {
    List(): Observable<PagedResponse<Work[]>>;
    Get(id: number): Observable<SingleResponse<Work>>;
    Add(work: Work): Observable<SingleResponse<Work>>;
    Update(work: Work): Observable<SingleResponse<Work>>;
    Delete(id: number): Observable<void>;
}