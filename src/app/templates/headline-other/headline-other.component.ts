import { Component, Input, inject } from '@angular/core';
import { ArrowBackBtnComponent } from '../arrow-back-btn/arrow-back-btn.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  
  onBackClick() {
    const uid = this.authService.getCurrentUid();
    if (uid) {
      this.router.navigate((['/summary']));
    } else {
      this.router.navigate((['']));
    }
  }
}
