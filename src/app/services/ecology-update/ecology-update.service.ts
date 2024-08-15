import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EcologyUpdateService {
  private notificationSubject = new Subject<number>();

  notification$ = this.notificationSubject.asObservable();

  updateEcology(message: number) {
    this.notificationSubject.next(message);
  }
}
