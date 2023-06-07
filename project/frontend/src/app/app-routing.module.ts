import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { PizzaPageComponent } from './components/pages/pizza-page/pizza-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { AddComponent } from './components/pages/add/add.component';
import { UpdateComponent } from './components/pages/update/update.component';
import { OrderSentComponent } from './components/pages/order-sent/order-sent.component';
import { UserOrdersComponent } from './components/pages/user-orders/user-orders.component';

const routes: Routes = [

  {path:'', component:HomeComponent},
  {path: 'search/:searched', component:HomeComponent},
  {path: 'food/:id', component: PizzaPageComponent},
  {path: 'cart-page', component: CartPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'registration', component: RegisterPageComponent},
  {path: 'checkout', component: CheckoutPageComponent},
  {path: 'add', component: AddComponent},
  {path: 'sent', component: OrderSentComponent},
  {path: 'orders', component: UserOrdersComponent},
  {path: 'update/:id', component: UpdateComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
