
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-guest',
  imports: [RouterModule, Toast],
  templateUrl: './plain.component.html',
  standalone: true,
  styleUrls: ['./plain.component.css']
})
export class PlainComponent {}
