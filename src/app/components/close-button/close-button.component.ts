import { Component, Input, OnInit } from '@angular/core';
import {Button} from "primeng/button";


@Component({
    selector: 'close-button',
    templateUrl: './close-button.component.html',
    styleUrls: ['./close-button.component.scss'],
  imports: [
    Button
  ],
    standalone: true
})
export class CloseButtonComponent implements OnInit {

  @Input("label") label:string;

  constructor() { }

  ngOnInit(): void {
  }

}
