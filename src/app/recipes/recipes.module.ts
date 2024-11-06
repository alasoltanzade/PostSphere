import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes.component';

import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';

import { SharedModule } from '../shared/shared.module';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipesDetailComponent } from './recipes-detail/recipes-detail.component';
import { RecipesItemComponent } from './recipes-list/recipes-item/recipes-item.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipesListComponent,
    RecipesDetailComponent,
    RecipesItemComponent,
    RecipeStartComponent,
    RecipeEditComponent,
  ],
  imports: [SharedModule, FormsModule],
})
export class RecipesModule {}
