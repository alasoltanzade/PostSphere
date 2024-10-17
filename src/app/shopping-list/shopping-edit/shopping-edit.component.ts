import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;

  subcription: Subscription;
  editMood = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) {}

  ngOnInit(): void {
    this.subcription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMood = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  // @ViewChild('nameInput') nameInputRef: ElementRef;
  // @ViewChild('amountInput') amountInputRef: ElementRef;
  // ingerantAdded = new EventEmitter<{name: string , amount: string}>();
  // @Output() ingerantAdded = new EventEmitter<Ingredient>();

  onAddItem(form: NgForm) {
    const value = form.value;
    // const IngredientName = this.nameInputRef.nativeElement.value;
    // const IngredientAmount = this.amountInputRef.nativeElement.value;
    // const newIngredient = new Ingredient(IngredientName, IngredientAmount);
    const newIngredient = new Ingredient(value.name, value.amount);
    // this.ingerantAdded.emit(newIngredient);

    if (this.editMood) {
      this.slService.updateIngeredient(this.editedItemIndex, newIngredient);
    } else {
      this.slService.addIngererant(newIngredient);
    }
    this.editMood = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMood = false;
  }

  onDelete() {
    this.slService.deteletIngredieat(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
}
