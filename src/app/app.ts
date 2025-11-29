import { Component, OnInit, signal, inject, afterNextRender } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Navbar } from '../Shared/Components/navbar/navbar';
import { Footer } from '../Shared/Components/footer/footer';
import { FeedComponent } from './Components/feed.component/feed.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, FeedComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit{
  protected readonly title = signal('infinite-scroll-feed');
  private router = inject(Router);
  
  constructor() {
    // Initialize Flowbite after the first render
    afterNextRender(() => {
      initFlowbite();
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });
    // Also initialize on first load
    initFlowbite();
  }
}
