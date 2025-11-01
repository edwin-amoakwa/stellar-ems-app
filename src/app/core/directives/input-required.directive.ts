import {
    Directive,
    ElementRef,
    Renderer2,
    Input,
    HostListener,
    AfterViewInit,
    Optional,
    Self,
    OnDestroy
} from '@angular/core';
import { NgControl, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

@Directive({
    selector: '[appValidateInput]',
    standalone: true
})
export class ValidateInputDirective implements AfterViewInit, OnDestroy {
    private _type: string = 'text';
    private _minLength: number = 2;
    private control?: AbstractControl;
    private tooltipElement?: HTMLElement;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        @Optional() @Self() private ngControl: NgControl
    ) {}

    /** Input type for validation: 'text', 'email', 'number' */
    @Input('appValidateInput')
    set type(value: string) {
        this._type = value?.toLowerCase() || 'text';
    }

    /** Minimum length validation */
    @Input() set minLength(value: number) {
        this._minLength = value ?? 2;
    }

    ngAfterViewInit() {
        this.control = this.ngControl?.control;
        if (this.control) {
            // Add validator to the control programmatically
            this.control.addValidators(this.customValidator.bind(this));
            this.control.updateValueAndValidity();

            this.control.statusChanges?.subscribe(() => this.updateStyle());
            this.control.valueChanges?.subscribe(() => this.updateStyle());

            // Initial style update
            setTimeout(() => this.updateStyle(), 0);
        }

        // Set parent position to relative for tooltip positioning
        const parent = this.el.nativeElement.parentElement;
        if (parent && getComputedStyle(parent).position === 'static') {
            this.renderer.setStyle(parent, 'position', 'relative');
        }
    }

    private customValidator(control: AbstractControl): ValidationErrors | null {
        const value = (control.value || '').toString().trim();

        if (!value) return { required: true };

        switch (this._type) {
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return { invalidEmail: true };
                break;

            case 'number':
                if (isNaN(+value)) return { invalidNumber: true };
                break;

            default:
                if (!/^[A-Za-z0-9\s]+$/.test(value)) return { invalidText: true };
                break;
        }

        if (value.length < this._minLength) {
            return {
                tooShort: { requiredLength: this._minLength, actualLength: value.length },
            };
        }

        return null;
    }

    @HostListener('input')
    @HostListener('blur')
    onUserInteraction() {
        if (!this.control) return;
        this.control.markAsTouched();
        this.control.updateValueAndValidity({ emitEvent: false });
        this.updateStyle();
    }

    private updateStyle() {
        if (!this.control) return;

        const errors = this.control.errors;
        const showError = !!errors && (this.control.touched || this.control.dirty);

        if (showError) {
            this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid red');
            this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#ffe6e6');
            this.showTooltip(errors);
        } else {
            this.renderer.removeStyle(this.el.nativeElement, 'border');
            this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
            this.hideTooltip();
        }
    }

    private showTooltip(errors: ValidationErrors | null) {
        if (!errors) {
            this.hideTooltip();
            return;
        }

        const message = this.getErrorMessage(errors);

        if (!this.tooltipElement) {
            this.tooltipElement = this.renderer.createElement('div');
            this.renderer.addClass(this.tooltipElement, 'validation-tooltip');

            // Tooltip styles
            this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
            this.renderer.setStyle(this.tooltipElement, 'background', '#d32f2f');
            this.renderer.setStyle(this.tooltipElement, 'color', 'white');
            this.renderer.setStyle(this.tooltipElement, 'padding', '6px 10px');
            this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
            this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
            this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
            this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
            this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 2px 8px rgba(0,0,0,0.2)');
            this.renderer.setStyle(this.tooltipElement, 'top', '100%');
            this.renderer.setStyle(this.tooltipElement, 'left', '0');
            this.renderer.setStyle(this.tooltipElement, 'margin-top', '5px');
            this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');

            // Arrow styles
            this.renderer.setStyle(this.tooltipElement, 'display', 'block');

            const parent = this.el.nativeElement.parentElement;
            this.renderer.appendChild(parent, this.tooltipElement);
        }

        // Update tooltip text
        this.renderer.setProperty(this.tooltipElement, 'textContent', message);
        this.renderer.setStyle(this.tooltipElement, 'display', 'block');
    }

    private hideTooltip() {
        if (this.tooltipElement) {
            this.renderer.setStyle(this.tooltipElement, 'display', 'none');
        }
    }

    private getErrorMessage(errors: ValidationErrors): string {
        if (errors['required']) {
            return 'This field is required';
        }

        if (errors['invalidEmail']) {
            return 'Please enter a valid email address';
        }

        if (errors['invalidNumber']) {
            return 'Please enter a valid number';
        }

        if (errors['invalidText']) {
            return 'Only letters, numbers, and spaces are allowed';
        }

        if (errors['tooShort']) {
            const { requiredLength, actualLength } = errors['tooShort'];
            return `Minimum ${requiredLength} characters required (current: ${actualLength})`;
        }

        return 'Invalid input';
    }

    // Public method to force style update from outside
    public forceStyleUpdate() {
        this.updateStyle();
    }

    // Static method to validate entire form and trigger visual feedback
    public static invalidForm(form: FormGroup): boolean {
        // Mark all controls as touched
        form.markAllAsTouched();

        // Emit events to trigger directive updates
        Object.keys(form.controls).forEach(key => {
            form.get(key)?.updateValueAndValidity({ emitEvent: true });
        });

        // Return validity status
        return !form.valid;
    }

    // Cleanup on destroy
    ngOnDestroy() {
        if (this.tooltipElement) {
            this.renderer.removeChild(this.el.nativeElement.parentElement, this.tooltipElement);
        }
    }
}
