import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AutoscrollService {
    constructor() { }

    scrollToElement(elementId: string) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }
}