import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nft-header',
  templateUrl: './nft-header.component.html',
  standalone: true,
})
export class NftHeaderComponent {
  // Data from Parent
  @Input() title!: string;
  @Input() subtitle!: string;
}
