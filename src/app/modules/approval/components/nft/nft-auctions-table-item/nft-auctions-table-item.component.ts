import { Component, Input, OnInit } from '@angular/core';
import { Nft } from '../../../models/nft';
import { CurrencyPipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: '[nft-auctions-table-item]',
  templateUrl: './nft-auctions-table-item.component.html',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    CurrencyPipe,
    DialogModule,
    ButtonModule,
    TooltipModule,
  ],
  styleUrls: ['./nft-auctions-table-item.component.scss'],
})
export class NftAuctionsTableItemComponent implements OnInit {
  showDialogDetail() {
    this.visibleDetail = true;
  }
  showDialogConfirm() {
    this.visibleConfirm = true;
  }

  @Input() auction = <Nft>{};
  visibleDetail: boolean = false;
  visibleConfirm: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
