import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { fileTypeFilter } from 'src/app/core/services/gist.service';
import { colors } from 'src/app/styles/colors';

@Directive({
  selector: '[appBadge]'
})
export class BadgeDirective implements OnInit {

  @Input() appBadge: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  ngOnInit(): void{
    if(this.appBadge) {
      const fileTypes = fileTypeFilter(this.appBadge);
      fileTypes.forEach((file: string) => {
          const span = this.createBadge(file);
          this.renderer.appendChild(this.el.nativeElement, span);
      });
    }
  }

  createBadge(file: string): HTMLSpanElement {
    const span: HTMLSpanElement = this.renderer.createElement('span');
    span.innerHTML = file
    span.className = 'badge'

    if(colors[file]) {
      span.style.backgroundColor = colors[file];
      return span;
    }

    span.style.backgroundColor = '#c7c7c7';
    return span;
  }

}
