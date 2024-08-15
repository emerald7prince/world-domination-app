import { Component } from '@angular/core';
import { Ecology } from '../../shared/ecology';
import { remult } from 'remult';
import { EcologyUpdateService } from '../services/ecology-update/ecology-update.service';
import { Subscription } from 'rxjs';
import { EndTurnService } from '../services/end-turn/end-turn.service';

@Component({
  selector: 'app-ecology',
  standalone: true,
  imports: [],
  templateUrl: './ecology.component.html',
  styleUrl: './ecology.component.css'
})
export class EcologyComponent {
  ecologyRepo = remult.repo(Ecology);
  ecology!: Ecology;
  
  private notificationEcologySubscription!: Subscription;
  private notificationEndTurnSubscription!: Subscription;

  unsubscribe = () => {};

  constructor(private ecologyUpdateService: EcologyUpdateService, private endTurnService: EndTurnService) {};

  ngOnInit() {
    this.ecologyRepo.liveQuery({
      limit: 1
    }).subscribe(info => (this.ecology = info.items[0]));

    this.notificationEcologySubscription = this.ecologyUpdateService.notification$.subscribe(
      (message) => {
        this.handleEcologyNotification(message);
      }
    );

    this.notificationEndTurnSubscription = this.endTurnService.notification$.subscribe(
      (message) => {
        this.handleEndTurnNotification(message);
      }
    );
  };

  handleEcologyNotification(message: number){
    this.ecology.level = this.ecology.level + message;
    console.log('Уровень экологии изменился на значение %i. Текущий уровень: %i.', message, this.ecology.level);
  };

  handleEndTurnNotification(message: string) {
    if (message == 'saveEcology') {
      this.saveEcology();
    }
  };

  async saveEcology() {
    try {
      await this.ecologyRepo.save(this.ecology);
    } catch(error: any) {
      alert(error.message);
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
    if (this.notificationEcologySubscription) {
      this.notificationEcologySubscription.unsubscribe();
    };
    if (this.notificationEndTurnSubscription) {
      this.notificationEndTurnSubscription.unsubscribe();
    }
  }
}
