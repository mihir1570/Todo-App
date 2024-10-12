import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TaskValidatorService {
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
      const totalAllowedHours = remainingHoursToday + (totalDays * 24)
      if (Number(estimatedTime) > totalAllowedHours) {
        return { invalidTimeError: 'Estimated time exceeds available hours.' };
      }
      if (selectedDueDate.getTime() < currentDate.setHours(0, 0, 0, 0)) {
        return { pastDateError: 'You cannot select a past date.' };
      }

      return null; 
    };
  }
}
