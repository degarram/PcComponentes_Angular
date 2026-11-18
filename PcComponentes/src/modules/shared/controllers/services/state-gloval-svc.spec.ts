import { TestBed } from '@angular/core/testing';
import { StateGlovalSvc } from './state-gloval-svc';

describe('StateGlovalSvc', () => {
  let service: StateGlovalSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateGlovalSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
