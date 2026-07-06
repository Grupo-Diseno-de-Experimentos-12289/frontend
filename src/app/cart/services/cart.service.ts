// Sin endpoint de carrito en el backend todavía: estado local persistido en localStorage,
// siguiendo el mismo patrón que AuthService (BehaviorSubject + localStorage).
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  experienceId: number;
  title: string;
  imageUrl: string;
  date: string;
  adults: number;
  pricePerPerson: number;
  rating: number;
}

const STORAGE_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>(this.readFromStorage());

  get items$(): Observable<CartItem[]> {
    return this.items.asObservable();
  }

  getAll(): CartItem[] {
    return this.items.value;
  }

  getById(id: string): CartItem | undefined {
    return this.items.value.find(item => item.id === id);
  }

  add(item: Omit<CartItem, 'id'>): CartItem {
    const newItem: CartItem = { ...item, id: this.generateId() };
    const updated = [...this.items.value, newItem];
    this.persist(updated);
    return newItem;
  }

  remove(id: string): void {
    const updated = this.items.value.filter(item => item.id !== id);
    this.persist(updated);
  }

  get subtotal(): number {
    return this.items.value.reduce((sum, item) => sum + item.pricePerPerson * item.adults, 0);
  }

  private generateId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private persist(items: CartItem[]): void {
    this.items.next(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private readFromStorage(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
