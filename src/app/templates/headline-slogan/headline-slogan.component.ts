import { Component, Input } from '@angular/core';


/**
 * This component displays a headline together with an additional slogan.
 * They are separated by a blue separator.
 */
@Component({
  selector: 'app-headline-slogan',
  standalone: true,
  imports: [],
  templateUrl: './headline-slogan.component.html',
  styleUrl: './headline-slogan.component.scss'
})
export class HeadlineSloganComponent {
@Input() headline: string = '';
@Input() slogan: string = '';
}
