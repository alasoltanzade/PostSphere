import { Component, Input, OnInit } from '@angular/core';
import { Recipes } from '../recipes.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
})
export class RecipesDetailComponent implements OnInit {
  // @Input() recipes: Recipes;
  recipes: Recipes;
  id: number;

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // const id = this.route.snapshot.params['id'];
    this.route.params
      .pipe(
        map((params) => {
          return +params['id'];
        }),
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipeState) => {
              return recipeState.recipes.find((recipe, index) => {
                return index === this.id;
              });
            }))
        //     .subscribe((params: Params) => {
        // this.id = +params['id'];
        // this.recipes = this.recipeService.getRecipe(this.id);
        
          .subscribe((recipe) => {
            this.recipes = recipe;
          });
      // });
  }

  onAddShoppingList() {
    this.recipeService.addIngredientToShoppingList(this.recipes.ingredients);
  }

  onEditRecipe() {
    // this.router.navigate(['edit'], { relativeTo: this.route });
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
