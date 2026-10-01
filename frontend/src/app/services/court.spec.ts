import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CourtService } from './court';

describe('CourtService', () => {

  let service: CourtService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ]
    });

    service = TestBed.inject(CourtService);

  });

  it('should be created', () => {

    expect(service).toBeTruthy();

  });

});