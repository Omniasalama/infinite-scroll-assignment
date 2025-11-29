import { Component, signal, computed, inject, PLATFORM_ID, afterNextRender, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { mockApi } from '../../Service/mock-api.service';
import { Item } from '../../../Interface/item.interface';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {

  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  items = signal<Item[]>([]);
  currentPage = signal(1);
  pageSize = 20; 
  hasMore = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);
  retryCount = signal(0);
  
  search = signal('');
  filterPrice = signal<'all' | 'low' | 'high'>('all');
  sortBy = signal<'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('default');
  viewMode = signal<'grid' | 'list'>('grid');

  filteredItems = computed(() => {
    let filtered = [...this.items()];
    const term = this.search().toLowerCase().trim();
    
    if (term) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.subtitle.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }
    
    if (this.filterPrice() === 'low') {
      filtered = filtered.filter(i => i.price < 5000);
    } else if (this.filterPrice() === 'high') {
      filtered = filtered.filter(i => i.price >= 5000);
    }
    
    return filtered;
  });

  sortedItems = computed(() => {
    const items = [...this.filteredItems()];
    const sort = this.sortBy();
    
    switch (sort) {
      case 'price-asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return items.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return items.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return items;
    }
  });

  showingRange = computed(() => {
    const total = this.sortedItems().length;
    return { total };
  });

  constructor() {
    afterNextRender(() => {
      this.loadPage();
      this.setupInfiniteScroll();
    });

    effect(() => {
      this.search();
      this.filterPrice();
      this.sortBy();
    });
  }

  setupInfiniteScroll() {
    if (!this.isBrowser) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const threshold = 200; 
        
        if (scrollPosition >= documentHeight - threshold && 
            !this.loading() && 
            this.hasMore() &&
            this.error() === null) {
          this.loadPage();
        }
      }, 100);
    });
  }

  async loadPage(retry = false) {
    if (this.loading() || (!retry && !this.hasMore())) return;
    
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const data = await mockApi(this.currentPage(), this.pageSize);
      
      if (data.length === 0) {
        this.hasMore.set(false);
      } else {
        this.items.update(prev => [...prev, ...data]);
        this.currentPage.update(p => p + 1);
        this.retryCount.set(0); 
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load items';
      this.error.set(errorMessage);
      console.error('Error loading page:', error);
    } finally {
      this.loading.set(false);
    }
  }

  retry() {
    this.retryCount.update(count => count + 1);
    this.loadPage(true);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  addToCart(item: Item) {
    console.log('Add to cart:', item);
  }

  shareItem(item: Item) {
    console.log('Share:', item);
  }

  compareItem(item: Item) {
    console.log('Compare:', item);
  }

  likeItem(item: Item) {
    console.log('Like:', item);
  }
}
