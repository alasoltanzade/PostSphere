import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipes } from '../../recipes.model';
// import { RecipesService } from '../../recipes.service';
@Component({
  selector: 'app-recipes-item',
  templateUrl: './recipes-item.component.html',
})
export class RecipesItemComponent {
  @Input() index: number;

  @Input() recipe: Recipes;
  // @Output() recepieSelected = new EventEmitter<void>();

  //we inject recipeService to this file
  // constructor(private recipeService: RecipesService) {}

  // onselected1() {
  //   // this.recepieSelected.emit();
  //   this.recipeService.recipeSelected.emit(this.recipe);
  // }
}
