import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Court, CourtService } from '../../services/court';

@Component({
  selector: 'app-admin-courts',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-courts.html',
  styleUrl: './admin-courts.css'
})
export class AdminCourts {

  courts: Court[] = [];

  courtName = '';
  pricePerHour = 0;
  status: 'active' | 'maintenance' = 'active';

  editingCourtId: string | null = null;

  constructor(
    private courtService: CourtService,
    private cdr: ChangeDetectorRef
  ) {}

  loadCourts() {
    this.courtService.getCourts().subscribe({
      next: (data) => {
        this.courts = data;
      },
      error: (error) => {
        console.error('Failed to load courts:', error);
      }
    });
  }

  ngOnInit() {
    this.loadCourts();
  }

  addCourt() {

    if (!this.courtName.trim()) {
      alert('Court name is required.');
      return;
    }

    if (this.courtName.trim().length < 2) {
      alert('Court name must be at least 2 characters.');
      return;
    }

    if (this.pricePerHour < 0) {
      alert('Price cannot be negative.');
      return;
    }

    const newCourt: Court = {
      name: this.courtName.trim(),
      pricePerHour: Number(this.pricePerHour),
      status: this.status
    };

    this.courtService.createCourt(newCourt).subscribe({
      next: () => {
        alert('Court added successfully.');

        this.clearForm();
        this.loadCourts();
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to add court.');
      }
    });
  }

  editCourt(court: Court) {
    this.editingCourtId = court._id || null;
    this.courtName = court.name;
    this.pricePerHour = court.pricePerHour;
    this.status = court.status;
  }

  updateCourt() {

    console.log('UPDATE BUTTON CLICKED');

    if (!this.editingCourtId) {
      return;
    }

    if (!this.courtName.trim()) {
      alert('Court name is required.');
      return;
    }

    if (this.courtName.trim().length < 2) {
      alert('Court name must be at least 2 characters.');
      return;
    }

    if (this.pricePerHour < 0) {
      alert('Price cannot be negative.');
      return;
    }

    const updatedCourt: Court = {
      name: this.courtName.trim(),
      pricePerHour: Number(this.pricePerHour),
      status: this.status
    };

    this.courtService.updateCourt(
      this.editingCourtId,
      updatedCourt
    ).subscribe({
      next: (data) => {

        const index = this.courts.findIndex(
          court => court._id === this.editingCourtId
        );

        if (index !== -1) {
          this.courts = this.courts.map(court =>
            court._id === this.editingCourtId ? data : court
          );
        }

        this.cdr.detectChanges();

        alert('Court updated successfully.');

        this.clearForm();
      },

      error: (error) => {
        alert(error.error?.message || 'Failed to update court.');
      }
    });
  }

  deleteCourt(id: string) {

    if (!confirm('Are you sure you want to delete this court?')) {
      return;
    }

    this.courtService.deleteCourt(id).subscribe({
      next: () => {

        this.courts = this.courts.filter(
          court => court._id !== id
        );

        this.cdr.detectChanges();

        alert('Court deleted successfully.');
      },

      error: (error) => {
        alert(error.error?.message || 'Failed to delete court.');
      }
    });
  }

  clearForm() {
    this.courtName = '';
    this.pricePerHour = 0;
    this.status = 'active';
    this.editingCourtId = null;
  }
}