// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { CardComponent } from '../theme/shared/components/card/card.component';
import {UserSession} from '../core/user-session';


@Component({
  selector: 'app-account-profile',
  imports: [CardComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user:any = UserSession.getUser();
  merchant:any = UserSession.getMerchant();

  ngOnInit() {

  }


}
