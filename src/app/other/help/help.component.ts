import { Component } from '@angular/core';
import { HeadlineOtherComponent } from '../../templates/headline-other/headline-other.component';
import { EmailComponent } from '../../main/contacts/email/email.component';


/**
 * This component displays a join usage manual
 */
@Component({
  selector: 'app-help',
  standalone: true,
  imports: [HeadlineOtherComponent, EmailComponent],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {

}
