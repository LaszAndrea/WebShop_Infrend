import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { CartItem } from 'src/app/shared/models/CartItem';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent {

  order: Order = new Order();
  checkoutForm!: FormGroup;

  constructor(private cartService: CartService, private formBuilder: FormBuilder, 
    private userService: UserService, private toastrService: ToastrService, private orderService: OrderService, private router: Router){

      const cart = cartService.getCart();
      this.order.items = cart.items;
      if(cart.totalPrice > 5000){
        this.order.totalPrice = cart.totalPrice*0.95;
      }else{
        this.order.totalPrice = cart.totalPrice;
      }

    }

    ngOnInit(): void{
      if(this.userService.currentUser.isAdmin){
        this.router.navigateByUrl('/');
      }
      let {name, address, phone} = this.userService.currentUser;
      this.checkoutForm = this.formBuilder.group({
        name: [{value: name, disabled: true}, Validators.required],
        address: [address, Validators.required],
        phone: [phone, Validators.required]
      });
    }

    get f(){
      return this.checkoutForm.controls;
    }

    createOrder(){
      if(this.checkoutForm.invalid){
        this.toastrService.warning('Kérem töltse ki az adataival a rendelést', 'Hibás kitöltés')
        return;
      }

      this.order.name = this.f.name.value;
      this.order.address = this.f.address.value;
      this.order.createdAt = new Date;
      this.order.items = this.cartService.getCart().items;
      this.order.phone = this.userService.currentUser.phone;
      this.order.status = 'NEW';
      this.order.totalPrice = this.cartService.getCart().totalPrice;


      this.orderService.createOrder(this.order).subscribe({
        next:()=>{
          this.router.navigateByUrl('/sent');
          this.userService.currentUser.address = this.order.address;
          this.userService.currentUser.name = this.order.name;
          this.cartService.clearCart();
        },
        error:(errorResponse)=>{
          this.toastrService.error(errorResponse.error, 'Valami hiba történt!');
        }
      })

    }

}
