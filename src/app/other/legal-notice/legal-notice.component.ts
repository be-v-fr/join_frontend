import { Component } from '@angular/core';
import { HeadlineOtherComponent } from '../../templates/headline-other/headline-other.component';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [HeadlineOtherComponent],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {

}
