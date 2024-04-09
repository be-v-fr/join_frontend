import { Component, Input } from '@angular/core';
import { User } from '../../../models/user';
import { PersonBadgeComponent } from '../../templates/person-badge/person-badge.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PersonBadgeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() currentUser: User | null | undefined = undefined;
}
