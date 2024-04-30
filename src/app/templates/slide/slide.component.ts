import { Component, Output, EventEmitter, OnInit } from '@angular/core';


/**
 * This component is set up to slide in upon initialization and to slide out upon closing.
 * For the sliding to work, it requires certain [ngClass] settings.
 * The closing method (in the parent component or in a component class extending this component) also requires a 125ms timeout
 * to prevent the slide component from disappearing immediately. 
 * It is also recommended to use it within an overlay.
 * 
 * Example of usage:
 * 
 * <div class="overlay">
 *     <app-slide class="slide-component"
 *         [ngClass]="{translated ? 'slid-out' : 'slid-in'}"
 *         (slide)="closeSlideComponent()">
 *     </div>
 * </div>
 */
@Component({
  selector: 'app-slide',
  standalone: true,
  imports: [],
  templateUrl: './slide.component.html',
  styleUrl: './slide.component.scss'
})
export class SlideComponent implements OnInit {
  translated: boolean = true;
  @Output() slide = new EventEmitter<void>();


  /**
   * When in translated state, slide in.
   * The timeout is only used as a workaround.
   */
  ngOnInit(): void {
    if (this.translated) {setTimeout(() => this.slideInOut(), 1)}
  }


  /**
   * Toggle translation state and emit slide event to the parent component
   */
  slideInOut() {
    this.translated = !this.translated;
    this.slide.emit();
  }
}