import { EventEmitter, Injectable } from '@angular/core';
import { Recipes } from './recipes.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipesService {
  recipeChanged = new Subject<Recipes[]>();

  // recipeSelected = new EventEmitter<Recipes>();
  // recipeSelected = new Subject<Recipes>();

  private recipes: Recipes[] = [
    new Recipes(
      'Ratatouille',
      ' Homemade Ratatouille Recipes',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_EzRX_OuUZ92uzLZ04JZpx5F-Qo1yrih4pzBBciV_sxwrKEYLMaZl9hoIr14yu8-rPkU&usqp=CAU',
      [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
    ),
    new Recipes(
      'Hamberger',
      ' Homemade Ham Recipes',
      'https://img.freepik.com/premium-photo/hamburger-table_862330-14558.jpg?w=360',
      [new Ingredient('Buns', 1), new Ingredient('Meat', 1)]
    ),
  ];

  // when we want to fetch a data we do not use dummy data instence
  // private recipes: Recipes[] = [];

  

  constructor(private slService: ShoppingListService) {}

  setRecipes(recipes: Recipes[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes() {
    //return this recipe to get it from the outside
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngrediant(ingredients);
  }

  addrecipe(recipe: Recipes) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipes) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.slice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}

// Constructor Injection
// Method Injection
// Property Injection

//we change were & how we manage our array of recipes
