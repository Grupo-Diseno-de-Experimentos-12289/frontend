import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { ExperienceService } from '../../experience-detail/services/experience.service';
import { toDisplayData } from '../../public/components/experience-card/experience-display.mock';

export interface CartItem {
  id: string; // availabilityId as string
  experienceId: number;
  title: string;
  imageUrl: string;
  date: string;
  adults: number;
  pricePerPerson: number;
  rating: number;
}

export interface CartResource {
  cartId: number;
  userId: number;
  items: {
    availabilityId: number;
    quantity: number;
    price: number;
  }[];
}

export interface AvailabilityResource {
  id: number;
  experienceId: number;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  private userId: number = Number(localStorage.getItem('userId')) || 1;
  private basePath = `${environment.serverBasePath}/carts`;

  constructor(
    private http: HttpClient,
    private experienceService: ExperienceService
  ) {
    this.loadCart();
  }

  get items$(): Observable<CartItem[]> {
    return this.items.asObservable();
  }

  getAll(): CartItem[] {
    return this.items.value;
  }

  getById(id: string): CartItem | undefined {
    return this.items.value.find(item => item.id === id);
  }

  loadCart(): void {
    this.userId = Number(localStorage.getItem('userId')) || 1;
    this.getOrCreateCart(this.userId).pipe(
      switchMap(cart => {
        if (!cart.items || cart.items.length === 0) {
          return of([]);
        }
        return forkJoin({
          availabilities: this.http.get<AvailabilityResource[]>(`${environment.serverBasePath}/availabilities`),
          experiences: this.experienceService.getAll()
        }).pipe(
          map(({ availabilities, experiences }) => {
            return cart.items.map(item => {
              const avail = availabilities.find(a => a.id === item.availabilityId);
              const exp = avail ? experiences.find(e => e.id === avail.experienceId) : null;
              return {
                id: item.availabilityId.toString(),
                experienceId: avail ? avail.experienceId : 0,
                title: exp ? exp.title : 'Unknown Experience',
                imageUrl: exp ? toDisplayData(exp, exp.id).imageUrl : '',
                date: avail ? avail.startDateTime.substring(0, 10) : '',
                adults: item.quantity,
                pricePerPerson: item.price,
                rating: exp ? toDisplayData(exp, exp.id).rating : 0
              };
            });
          })
        );
      })
    ).subscribe({
      next: mappedItems => this.items.next(mappedItems),
      error: err => console.error('Failed to load cart', err)
    });
  }

  getOrCreateCart(userId: number): Observable<CartResource> {
    return this.http.get<CartResource>(`${this.basePath}/${userId}`).pipe(
      catchError(err => {
        if (err.status === 404) {
          return this.http.post<CartResource>(this.basePath, { userId });
        }
        return throwError(() => err);
      })
    );
  }

  add(item: Omit<CartItem, 'id'> & { availabilityId?: number }): Observable<CartItem> {
    const availabilityId = item.availabilityId || Number(item.experienceId);
    this.userId = Number(localStorage.getItem('userId')) || 1;

    return this.getOrCreateCart(this.userId).pipe(
      switchMap(() => {
        const body = {
          availabilityId: availabilityId,
          quantity: item.adults,
          price: item.pricePerPerson
        };
        return this.http.post<any>(`${this.basePath}/${this.userId}/items`, body);
      }),
      tap(() => this.loadCart()),
      map(() => {
        return {
          ...item,
          id: availabilityId.toString()
        };
      })
    );
  }

  remove(id: string): void {
    this.userId = Number(localStorage.getItem('userId')) || 1;
    const body = { availabilityId: Number(id) };

    this.http.delete<CartResource>(`${this.basePath}/${this.userId}/items`, { body }).subscribe({
      next: () => this.loadCart(),
      error: err => console.error('Failed to remove cart item', err)
    });
  }

  get subtotal(): number {
    return this.items.value.reduce((sum, item) => sum + item.pricePerPerson * item.adults, 0);
  }
}
