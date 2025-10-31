import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'button-toolbar',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './button-toolbar.component.html',
  styleUrl: './button-toolbar.component.scss'
})
export class ButtonToolbarComponent {
  // Controls the horizontal alignment of the toolbar content. Defaults to right.
  @Input() align: 'left' | 'centre' | 'right' = 'right';

  // Map the align input to the appropriate CSS justify-content value.
  get justifyContent(): 'flex-start' | 'center' | 'flex-end' {
    switch (this.align) {
      case 'left':
        return 'flex-start';
      case 'centre': // British spelling as requested
        return 'center';
      case 'right':
      default:
        return 'flex-end';
    }
  }
}
