import { TestBed } from '@angular/core/testing';

import { BibliografiasService } from './bibliografias.service';

describe('BibliografiasService', () => {
  let service: BibliografiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliografiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
