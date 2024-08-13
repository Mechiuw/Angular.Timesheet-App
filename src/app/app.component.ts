import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgClass, RouterOutlet],
})
export class AppComponent {
  title = 'Timesheet App';

  constructor(public themeService: ThemeService) {}
}
