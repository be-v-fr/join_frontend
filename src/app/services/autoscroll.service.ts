import { Injectable } from '@angular/core';


/**
 * This injectable handles automatic scrolling
 */
@Injectable({
    providedIn: 'root'
})
export class AutoscrollService {
   
   
    /**
     * Scroll element into view
     * @param elementId HTML element id attribute value
     */
    scrollIntoView(elementId: string) {
        const element = document.getElementById(elementId);
        if (element) {element.scrollIntoView({ behavior: "smooth", inline: "nearest" })}
    }


    /**
     * Scroll element to bottom
     * @param elementId HTML element id attribute value
     */
    scrollToBottom(elementId: string) {
        const element = document.getElementById(elementId);
        if (element) {element.scrollTop = element.scrollHeight}
    }


    scrollWhileDragging(scrollSpeed: number) {
        const wrapper = document.getElementById('pageWrapper');
        if(wrapper) {wrapper.scrollBy(0, scrollSpeed);
        }
    }
}