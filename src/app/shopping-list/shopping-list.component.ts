import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingSerive } from '../logging-service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  providers: [],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  private igchangeSub: Subscription;

  constructor(
    // private slService: ShoppingListService,
    private loggingService: LoggingSerive,
    private store: Store<fromApp.AppState>
  ) {}

  // onIngAdded(ingredient: Ingredient) {
  //   this.ingredient.push(ingredient);
  // }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');

    // this.ingredient = this.slService.getIngererants();
    // this.igchangeSub = this.slService.ingredientChanged.subscribe(
    //   (ingeridents: Ingredient[]) => {
    //     this.ingredient = ingeridents;
    //   }
    // );

    this.loggingService.printLog('Hello from shoppingList Component');
  }

  onEditItem(index: number) {
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
    // so now we can listen to it in other place
  }

  ngOnDestroy() {
    // this.igchangeSub.unsubscribe();
  }
}
