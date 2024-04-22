import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AutoscrollService {
    constructor() { }

    scrollIntoView(elementId: string) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", inline: "nearest" });
        }
    }

    scrollToBottom(elementId: string) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }
}