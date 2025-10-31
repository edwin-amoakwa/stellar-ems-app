import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  standalone: true,
  imports: [NgClass],
  styleUrl: './card.component.scss'
})
export class CardComponent {
  // public props (backward compatible)
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input('subTitle') set subTitle(value: string | undefined) { this.subtitle = value; }
  @Input() customHeader: boolean = false; // when true, consumer provides header content via [card-header]

  // adaptability/theming props
  @Input() variant: 'default' | 'outlined' | 'flat' = 'default';
  @Input() elevation: 0 | 1 | 2 = 1; // maps to shadow intensity
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';
  @Input() headerAlign: 'left' | 'center' | 'right' = 'left';

  get variantClass(): string {
    switch (this.variant) {
      case 'outlined':
        return 'outlined';
      case 'flat':
        return 'flat';
      default:
        return 'default';
    }
  }

  get elevationClass(): string {
    return this.elevation === 0 ? 'elevation-0' : this.elevation === 2 ? 'elevation-2' : 'elevation-1';
  }

  get paddingClass(): string {
    return this.padding === 'sm' ? 'pad-sm' : this.padding === 'lg' ? 'pad-lg' : 'pad-md';
  }

  get headerAlignClass(): string {
    return this.headerAlign === 'center'
      ? 'header-center'
      : this.headerAlign === 'right'
      ? 'header-right'
      : 'header-left';
  }
}
