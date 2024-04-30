import { Component, Input, inject } from '@angular/core';
import { ArrowBackBtnComponent } from '../arrow-back-btn/arrow-back-btn.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


/**
 * This component displays a headline together with a functional inline arrow back button.
 * It is to be used for the components in the "app/other" directory.
 */
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
  private authService = inject(AuthService);


  /**
   * On arrow back click, navigate...
   * - to the summary page if logged in
   * - to the general landing page if not logged in
   */
  onBackClick() {
    const uid = this.authService.getCurrentUid();
    uid ? this.router.navigate((['/summary'])) : this.router.navigate((['']));
  }
}