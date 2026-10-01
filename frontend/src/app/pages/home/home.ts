
import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

interface Court {
  _id: string;
  name: string;
  pricePerHour: number;
  status: string;
}

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  isLoggedIn = signal(!!sessionStorage.getItem('token'));

  courts = signal<Court[]>([]);
  errorMessage = signal('');

  selectedCourt = signal<Court | null>(null);
  bookingMessage = signal('');
  bookingSuccess = signal(false);
  isBooking = signal(false);

  bookingForm;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.nonNullable.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.http
      .get<Court[]>('http://localhost:3000/api/courts')
      .subscribe({
        next: (data) => {
          this.courts.set(data);
        },
        error: () => {
          this.errorMessage.set('Failed to load courts');
        }
      });
  }

  selectCourt(court: Court): void {
    this.selectedCourt.set(court);
    this.bookingMessage.set('');
    this.bookingSuccess.set(false);
    this.bookingForm.reset();
  }

  submitBooking(): void {
    this.bookingMessage.set('');

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const court = this.selectedCourt();

    if (!court) {
      return;
    }

    const token = sessionStorage.getItem('token');

    if (!token) {
      this.bookingSuccess.set(false);
      this.bookingMessage.set('Please log in before booking.');
      return;
    }

    const { date, startTime, endTime } =
      this.bookingForm.getRawValue();

    if (startTime >= endTime) {
      this.bookingSuccess.set(false);
      this.bookingMessage.set('End time must be after start time.');
      return;
    }

    this.isBooking.set(true);

    

    this.http.post<{ message: string }>(
      'http://localhost:3000/api/bookings',
      {
        courtId: court._id,
        date,
        startTime,
        endTime
      },
      
    ).subscribe({
      next: (response) => {
        this.bookingMessage.set(response.message);
        this.bookingSuccess.set(true);
        this.isBooking.set(false);
        this.bookingForm.reset();
      },
      error: (error) => {
        this.bookingMessage.set(
          error.error?.message || 'Booking failed'
        );
        this.bookingSuccess.set(false);
        this.isBooking.set(false);
      }
    });
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.selectedCourt.set(null);
    this.bookingMessage.set('');
    this.bookingSuccess.set(false);
    this.bookingForm.reset();
  }
}