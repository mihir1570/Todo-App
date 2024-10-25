import { Directive } from '@angular/core';

@Directive({
  selector: '[appNumbersonly]',
  standalone: true
})
export class NumbersonlyDirective {

  constructor() { }

}
