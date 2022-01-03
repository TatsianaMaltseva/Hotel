import { Component } from '@angular/core';

import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent {
  public get isClient(): boolean {
    return this.accountService.isClient;
  }

  public constructor(
    private readonly accountService: AccountService
  ) { 
  }
}