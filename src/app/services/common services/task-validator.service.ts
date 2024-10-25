// import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// export class TaskValidatorService {
//   static validateTaskTime(): ValidatorFn {
//     return (control: AbstractControl): ValidationErrors | null => {
//       const dueDate = control.get('taskDueDate')?.value;
//       const estimatedTime = control.get('taskEstimatedTime')?.value;
//       if (!dueDate || !estimatedTime) {
//         return null;
//       }
//       const selectedDueDate = new Date(dueDate);
//       const currentDate = new Date();
//       currentDate.setSeconds(0, 0);
//       const currentHours = currentDate.getHours();
//       const remainingHoursToday = 24 - currentHours;
//       const timeDiff = selectedDueDate.getTime() - currentDate.getTime();
//       const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
//       const totalAllowedHours = remainingHoursToday + totalDays * 24;
//       if (Number(estimatedTime) > totalAllowedHours) {
//         return { invalidTimeError: 'Estimated time exceeds available hours.' };
//       }
//       if (selectedDueDate.getTime() < currentDate.setHours(0, 0, 0, 0)) {
//         return { pastDateError: 'You cannot select a past date.' };
//       }
//       return null;
//     };
//   }
// }

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TaskValidatorService {
  // This validates both the estimated time and due date
  static validateTaskTime(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dueDate = control.get('taskDueDate')?.value;
      const estimatedTime = control.get('taskEstimatedTime')?.value;

      if (!dueDate || !estimatedTime) {
        return null;
      }

      const selectedDueDate = new Date(dueDate);
      const currentDate = new Date();
      currentDate.setSeconds(0, 0);
      const currentHours = currentDate.getHours();
      const remainingHoursToday = 24 - currentHours;

      const timeDiff = selectedDueDate.getTime() - currentDate.getTime();
      const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const totalAllowedHours = remainingHoursToday + totalDays * 24;

      if (Number(estimatedTime) > totalAllowedHours) {
        return { invalidTimeError: 'Estimated time exceeds available hours.' };
      }

      if (selectedDueDate.getTime() < currentDate.setHours(0, 0, 0, 0)) {
        return { pastDateError: 'You cannot select a past date.' };
      }

      return null;
    };
  }

  // This validates the estimated time field for proper formatting
  static validTimeFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const timeValue = control.value;

      // Allow empty value to avoid unnecessary validation errors on untouched fields
      if (!timeValue) {
        return null;
      }

      // Regular expression to validate hours.minutes format
      const timeRegex = /^(0|[1-9][0-9]*)(\.(0[0-9]|[1-5][0-9]))?$/;

      if (!timeRegex.test(timeValue)) {
        return {
          invalidTimeFormat:
            'Invalid time format. Use valid hours and minutes (e.g., 5.30 for 5 hours 30 minutes).',
        };
      }

      return null;
    };
  }
}
