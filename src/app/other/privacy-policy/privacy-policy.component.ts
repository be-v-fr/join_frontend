import { Component } from '@angular/core';
import { HeadlineOtherComponent } from '../../templates/headline-other/headline-other.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [HeadlineOtherComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

}
