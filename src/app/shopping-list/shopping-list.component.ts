import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingSerive } from '../logging-service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  providers: [],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredient: Ingredient[];

  private igchangeSub: Subscription;

  constructor(
    private slService: ShoppingListService,
    private loggingService: LoggingSerive
  ) {}

  // onIngAdded(ingredient: Ingredient) {
  //   this.ingredient.push(ingredient);
  // }

  ngOnInit() {
    this.ingredient = this.slService.getIngererants();
    this.igchangeSub = this.slService.ingredientChanged.subscribe(
      (ingeridents: Ingredient[]) => {
        this.ingredient = ingeridents;
      }
    );

    this.loggingService.printLog('Hello from shoppingList Component')
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
    // so now we can listen to it in other place
  }

  ngOnDestroy() {
    this.igchangeSub.unsubscribe();
  }
}
