import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';

describe('authGuard', () => {

  let router: {
    createUrlTree: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {

    router = {
      createUrlTree: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: router
        }
      ]
    });

    sessionStorage.clear();

  });

  it('should allow access when token exists', () => {

    sessionStorage.setItem('token', 'test-token');

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBe(true);

  });

  it('should redirect to login when token does not exist', () => {

    const fakeUrlTree = {};

    router.createUrlTree.mockReturnValue(fakeUrlTree);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(fakeUrlTree);

  });

});