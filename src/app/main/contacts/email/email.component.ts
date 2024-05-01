import { Component, Input } from '@angular/core';


/**
 * This component displays a linked email address.
 */
@Component({
  selector: 'app-email',
  standalone: true,
  imports: [],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent {
@Input() email: string = 'email';
}
