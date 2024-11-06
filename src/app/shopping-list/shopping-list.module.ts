import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { SharedModule } from '../shared/shared.module';
import { LoggingSerive } from '../logging-service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: ShoppingListComponent }]),
    SharedModule,
    FormsModule,
  ],
  providers: [LoggingSerive],
})
export class ShoppingListModule {}
