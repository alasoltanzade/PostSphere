// import { EventEmitter, Injectable } from '@angular/core';
// import { Ingredient } from '../shared/ingredient.model';
// import { Subject } from 'rxjs';

// @Injectable()
// export class ShoppingListService {
//   // ingredientChanged = new EventEmitter<Ingredient[]>();
//   ingredientChanged = new Subject<Ingredient[]>();
//   startedEditing = new Subject<number>();

//   private ingredient: Ingredient[] = [
//     new Ingredient('Apple', 5),
//     new Ingredient('Tomato', 10),
//   ];

//   getIngererants() {
//     return this.ingredient.slice();
//   }

//   getIngredient(index: number) {
//     return this.ingredient[index];
//   }

//   addIngererant(ingredient: Ingredient) {
//     this.ingredient.push(ingredient);
//     // this.ingredientChanged.emit(this.ingredient.slice());
//     this.ingredientChanged.next(this.ingredient.slice());
//   }

//   addIngrediant(ingredients: Ingredient[]) {
//     // for(let ingredient of ingredients){
//     //   this.addIngererant(ingredient); }

//     this.ingredient.push(...ingredients); //to turn an array of elemnt to list of elemn
//     // this.ingredientChanged.emit(this.ingredient.slice());
//     this.ingredientChanged.next(this.ingredient.slice());
//     // we use next to emit or send a value
//   }

//   updateIngeredient(index: number, newIngredient: Ingredient) {
//     this.ingredient[index] = newIngredient;
//     this.ingredientChanged.next(this.ingredient.slice());
//   }

//   deteletIngredieat(index: number) {
//     this.ingredient.splice(index, 1);
//     this.ingredientChanged.next(this.ingredient.slice());
//   }
// }
