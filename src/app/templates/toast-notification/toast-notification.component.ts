import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


/**
 * This component displays a toast notification sliding in from below the viewport.
 */
@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss'
})
export class ToastNotificationComponent {
  @Input() message: string = '';
  @Input() show: boolean = false;
}
