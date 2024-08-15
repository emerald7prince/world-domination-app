import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Country } from '../../../shared/country';
import { Sanction } from '../../../shared/sanction';

@Injectable({
  providedIn: 'root'
})
export class SanctionUpdateService {
  private notificationSubject = new Subject<Sanction>();

  notification$ = this.notificationSubject.asObservable();

  sendNotification(sanction: Sanction) {
    this.notificationSubject.next(sanction);
  }
}
