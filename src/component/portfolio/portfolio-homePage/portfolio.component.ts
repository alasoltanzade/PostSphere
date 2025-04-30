import { Component, OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenuModule } from 'primeng/megamenu';
import { TabsModule } from 'primeng/tabs';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    MegaMenuModule,
    TabsModule,
    AnimateOnScrollModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ScrollerModule,
    ScrollPanelModule,
    StepperModule,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnInit {
  items: MegaMenuItem[] | undefined;
  items2!: string[];
  swiper!: Swiper;
  index: any;
  intervalId: any;

  ngOnInit() {
    this.items2 = Array.from({ length: 5 }).map((_, i) => `Item #${i}`);


  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  ngAfterViewInit() {
    this.swiper = new Swiper('.swiper-container', {
      modules: [Autoplay, Navigation, Pagination],
      slidesPerView: 6,
      spaceBetween: 40,
      effect: 'slide',
      rewind: true,
      autoplay: {
        delay: 1000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  startAutoScroll() {
    this.intervalId = setInterval(() => {
      if (this.swiper) {
        this.swiper.slideNext();
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}
