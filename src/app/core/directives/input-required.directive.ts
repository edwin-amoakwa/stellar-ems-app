import {
    AfterViewInit, ChangeDetectorRef,
    Directive,
    ElementRef,
    forwardRef,
    HostListener,
    Injector,
    Input,
    OnChanges, Optional,
    Renderer2, Self
} from "@angular/core";
import {
    AbstractControl,
    FormGroup,
    NG_VALIDATORS,
    NgControl,
    ValidationErrors,
    Validator,
    ValidatorFn
} from "@angular/forms";
@Directive({
    selector: '[appValidateInput]',
})
export class ValidateInputDirective implements AfterViewInit {
    private _type: string = 'text';
    private _minLength: number = 2;
    private control?: AbstractControl;

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
        } else {
            this.renderer.removeStyle(this.el.nativeElement, 'border');
            this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
        }
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
}
