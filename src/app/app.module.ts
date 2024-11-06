import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { RecipesModule } from './recipes/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { BrowserModule } from '@angular/platform-browser';

// NgModule= to set certain things up & group certain things toghether
@NgModule({
  declarations: [AppComponent, HeaderComponent],

  // import other module to this module
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    RecipesModule,
    ShoppingListModule,
    
  ],

  // schemas: [NO_ERRORS_SCHEMA],

  // exports  it is not that much impoartant to export component

  // we defind all service we wanna provide - any service u plan or injecting need to be provide
  // providers: [ShoppingListService, ShoppingGuard, RecipesService],

  //for starting your app it defind which component is available right in that index html
  bootstrap: [AppComponent],

  // entryComponents: []
})
export class AppModule {}

// 418
