import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static trimmedMinLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (value && value.length < minLength) {
        return { trimmedMinLength: true };
      }
      return null;
    };
  }

  static trimmedMaxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (value && value.length > maxLength) {
        return { trimmedMaxLength: true };
      }
      return null;
    };
  }
}
