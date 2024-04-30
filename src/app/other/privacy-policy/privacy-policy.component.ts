import { Component, inject } from '@angular/core';
import { HeadlineOtherComponent } from '../../templates/headline-other/headline-other.component';
import { AutoscrollService } from '../../services/autoscroll.service';


/**
 * This component displays the join privacy policy
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [HeadlineOtherComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  private autoscrollService = inject(AutoscrollService);


  /**
   * Scroll element into view
   * @param elementId HTML element id attribute value
   */
  scrollIntoView(elementId: string) {
    this.autoscrollService.scrollIntoView(elementId);
  }
}