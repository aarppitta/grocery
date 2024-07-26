import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/user/home/home.component';
import { NavbarComponent } from './components/user/navbar/navbar.component';
import { LoginComponent } from './components/user/login/login.component';
import { FooterComponent } from './components/user/footer/footer.component';
import { RegisterComponent } from './components/user/register/register.component';
import { ContactComponent } from './components/user/contact/contact.component';
import { VegComponent } from './components/categories/veg/veg.component';
import { FruitsComponent } from './components/categories/fruits/fruits.component';
import { BeerComponent } from './components/categories/beer/beer.component';
import { CartComponent } from './components/user/cart/cart.component';
import { CheckoutComponent } from './components/user/checkout/checkout.component';
import { SidebarComponent } from './components/admin/sidebar/sidebar.component';
import { UserlistComponent } from './components/admin/userlist/userlist.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { ProductlistComponent } from './components/admin/productlist/productlist.component';
import { ProductcategoryComponent } from './components/admin/productcategory/productcategory.component';
import { UserlistUpdateComponent } from './components/admin/userlist-update/userlist-update.component';
import { ProductlistUpdateComponent } from './components/admin/productlist-update/productlist-update.component';
import { ProductcategoryUpdateComponent } from './components/admin/productcategory-update/productcategory-update.component';
import { UserlistAddComponent } from './components/admin/userlist-add/userlist-add.component';
import { ProductlistAddComponent } from './components/admin/productlist-add/productlist-add.component';
import { ProductcategoryAddComponent } from './components/admin/productcategory-add/productcategory-add.component';
import { AdminProfileComponent } from './components/admin/admin-profile/admin-profile.component';
import { ProductDescriptionComponent } from './components/user/product-description/product-description.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    FooterComponent,
    RegisterComponent,
    ContactComponent,
    VegComponent,
    FruitsComponent,
    BeerComponent,
    CartComponent,
    CheckoutComponent,
    SidebarComponent,
    UserlistComponent,
    AdminHomeComponent,
    ProductlistComponent,
    ProductcategoryComponent,
    UserlistUpdateComponent,
    ProductlistUpdateComponent,
    ProductcategoryUpdateComponent,
    UserlistAddComponent,
    ProductlistAddComponent,
    ProductcategoryAddComponent,
    AdminProfileComponent,
    ProductDescriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
