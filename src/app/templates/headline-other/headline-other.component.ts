import { Component, Input, inject } from '@angular/core';
import { ArrowBackBtnComponent } from '../arrow-back-btn/arrow-back-btn.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headline-other',
  standalone: true,
  imports: [ArrowBackBtnComponent],
  templateUrl: './headline-other.component.html',
  styleUrl: './headline-other.component.scss'
})
export class HeadlineOtherComponent {
  @Input() headline: string = '';
  private router = inject(Router);
  
  navigateToSummary() {
    // FALL BEHANDELN, DASS USER NICHT EINGELOGGT
    this.router.navigate((['/summary']));
  }
}
