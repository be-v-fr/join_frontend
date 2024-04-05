import { Component, Input } from '@angular/core';

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
