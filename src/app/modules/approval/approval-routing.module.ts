import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalComponent } from './approval.component';
import { OnProgressComponent } from './pages/on-progress/on-progress.component';
import { HistoryComponent } from './pages/history/history.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalComponent,
    children: [
      { path: '', redirectTo: 'ApprovalComponent', pathMatch: 'full' },
      { path: 'on-progress', component: OnProgressComponent },
      { path: 'history', component: HistoryComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }
