
import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Booking {
  _id: string;
  court: {
    name: string;
    pricePerHour: number;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

@Component({
  selector: 'app-my-bookings',
  imports: [],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings implements OnInit {
  bookings = signal<Booking[]>([]);
  message = signal('');
  loading = signal(true);
  cancellingId = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.message.set('Please log in to view your bookings.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.http.get<Booking[]>(
  'http://localhost:3000/api/bookings/my'
).subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.message.set(
          error.error?.message || 'Failed to load bookings.'
        );
        this.loading.set(false);
      }
    });
  }

  cancelBooking(bookingId: string): void {
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.message.set('Please log in again.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?'
    );

    if (!confirmed) {
      return;
    }

    

    this.cancellingId.set(bookingId);
    this.message.set('');

    this.http.patch(
  `http://localhost:3000/api/bookings/${bookingId}/cancel`,
  {}
).subscribe({
      next: () => {
        this.cancellingId.set(null);
        this.message.set('Booking cancelled successfully.');
        this.loadBookings();
      },
      error: (error) => {
        this.cancellingId.set(null);
        this.message.set(
          error.error?.message || 'Failed to cancel booking.'
        );
      }
    });
  }
}