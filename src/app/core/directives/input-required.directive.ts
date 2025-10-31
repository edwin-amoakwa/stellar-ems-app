import { Directive, HostBinding } from '@angular/core';
import {NgControl} from "@angular/forms";

/**
 * InputRequiredDirective
 *
 * Usage: add attribute `InputRequired` to any input-like element to force PrimeNG invalid styling
 * by applying `ng-invalid` and `ng-dirty` classes. This is a lightweight visual indicator for
 * required fields per design request. It does not change validation logic.
 */
@Directive({
  selector: "[appInputRequired]"
})
export class InputRequiredDirective {
    constructor(private control: NgControl) {}

    // Bind to Angular form control state
    @HostBinding('class.ng-invalid')
    get invalid() {
        return this.control.invalid && (this.control.dirty || this.control.touched);
    }

    @HostBinding('class.ng-dirty')
    get dirty() {
        return this.control.dirty;
    }

    // Accessibility attribute
    @HostBinding('attr.aria-required')
    ariaRequired = 'true';
}
