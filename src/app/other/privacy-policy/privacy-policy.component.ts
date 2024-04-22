import { Component, inject } from '@angular/core';
import { HeadlineOtherComponent } from '../../templates/headline-other/headline-other.component';
import { AutoscrollService } from '../../services/autoscroll.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [HeadlineOtherComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  private autoscrollService = inject(AutoscrollService);

  scrollIntoView(elementId: string) {
    this.autoscrollService.scrollIntoView(elementId);
  }
}