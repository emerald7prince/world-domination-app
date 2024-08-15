import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EndTurnService {
  private notificationSubject = new Subject<string>();

  notification$ = this.notificationSubject.asObservable();

  sendMessage(message: string) {
    this.notificationSubject.next(message);
  }
}
