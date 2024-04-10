import { Component, Output, EventEmitter, OnInit } from '@angular/core';

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

  ngOnInit(): void {
    if (this.translated) {
      setTimeout(() => this.slideInOut(), 1);
    }
  }

  slideInOut() {
    this.translated = !this.translated;
    this.slide.emit();
  }
}