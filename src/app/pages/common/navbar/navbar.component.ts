import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, input, output, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  // ngAfterViewInit() {
  //   // Theme toggle
  //   const toggler = document.getElementById('theme-toggle') as HTMLInputElement;
  //   toggler.addEventListener('change', function () {
  //     if (toggler.checked) {
  //       document.body.classList.add('dark');
  //     } else {
  //       document.body.classList.remove('dark');
  //     }
  //   });
  // }
}
