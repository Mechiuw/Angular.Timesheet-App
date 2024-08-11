import { Component } from '@angular/core';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { TitleHeaderComponent } from '../../shared/components/title-header/title-header.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [UserFormComponent, UserListComponent, TitleHeaderComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  // NFT Header
  title: string = 'Master Data';
  subtitle: string = 'Users';
}
