import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/user/home/home.component';
import { LoginComponent } from './components/user/login/login.component';
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

const routes: Routes = [
  { path:'', component: HomeComponent },
  { path:'login', component: LoginComponent },
  { path:'register', component: RegisterComponent },
  { path:'contact', component: ContactComponent },
  { path:'veg', component: VegComponent },
  { path:'fruits', component: FruitsComponent },
  { path:'beer', component: BeerComponent },
  { path:'product_description', component: ProductDescriptionComponent },
  { path:'cart', component: CartComponent },
  { path:'checkout', component: CheckoutComponent },

  { path:'sidebar', component: SidebarComponent },
  { path:'admin_home', component: AdminHomeComponent },
  { path:'admin_profile', component: AdminProfileComponent },
  { path:'userlist', component: UserlistComponent },
  { path:'userlist_add', component: UserlistAddComponent },
  { path:'userlist_update', component: UserlistUpdateComponent },
  { path:'productlist', component: ProductlistComponent },
  { path:'productlist_add', component: ProductlistAddComponent },
  { path:'productlist_update/:id', component: ProductlistUpdateComponent },
  { path:'productcategory', component: ProductcategoryComponent },
  { path:'productcategory_add', component: ProductcategoryAddComponent },
  { path:'productcategory_update/:id', component: ProductcategoryUpdateComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
