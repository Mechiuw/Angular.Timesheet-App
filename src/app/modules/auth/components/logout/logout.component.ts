import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.authService.logout()
    this.router.navigate(['/auth']).finally()
  }

}
