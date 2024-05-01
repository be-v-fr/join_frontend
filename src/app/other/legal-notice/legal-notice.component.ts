import { Component } from '@angular/core';
import { HeadlineOtherComponent } from '../../templates/headline-other/headline-other.component';
import { EmailComponent } from '../../main/contacts/email/email.component';


/**
 * This component displays a join legal notice
 */
@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [HeadlineOtherComponent, EmailComponent],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {

}
