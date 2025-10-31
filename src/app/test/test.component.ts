// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { CardComponent } from '../theme/shared/components/card/card.component';
import {UserSession} from '../core/user-session';


@Component({
  selector: 'app-test',
  imports: [CardComponent, CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  user:any = UserSession.getUser();
  merchant:any = UserSession.getMerchant();

  ngOnInit() {

  }


}
