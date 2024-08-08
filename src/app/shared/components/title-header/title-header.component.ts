import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-header',
  templateUrl: './title-header.component.html',
  standalone: true,
})
export class TitleHeaderComponent {
  // Data from Parent
  @Input() title!: string;
  @Input() subtitle!: string;
}
