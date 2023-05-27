import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-order-sent',
  templateUrl: './order-sent.component.html',
  styleUrls: ['./order-sent.component.css']
})
export class OrderSentComponent {

  constructor(private userService: UserService, private orderService: OrderService, 
    private router: Router, private toastrService: ToastrService, private cartService: CartService){}

  user = this.userService.currentUser;
  time = '';
  estDel = new Date;
  currentOrder = new Order();

  ngOnInit() {

    if(this.user.isAdmin){
      this.router.navigateByUrl('/');
    }

    this.orderService.getOrdersByUserId(this.user.id).subscribe(order => {

      for(let i=0; i<order.length; i++){
        if(order[i].status == 'NEW'){
          this.currentOrder = order[i];
          this.estDel = new Date(order[i].estDel);
        }
      }


      const hours = this.estDel.getHours().toString().padStart(2, '0');
      const minutes = this.estDel.getMinutes().toString().padStart(2, '0');

      this.time = `${hours}:${minutes}`;

    });
  }

  deleteOrder() {
    this.orderService.deleteOrder(this.user.id).subscribe(
      () => {
        this.toastrService.success('Rendelés sikeresen törölve.');
        this.cartService.clearCart();
        this.router.navigateByUrl('/');
      },
      (errorResponse) => {
        this.toastrService.error(errorResponse, 'Valami hiba történt!');
      }
    );
  }
  

}
