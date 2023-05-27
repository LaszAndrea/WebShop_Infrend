import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Order';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent {

  orders: Order[] = [];
  user: User = this.userService.currentUser;

  constructor(private orderService: OrderService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    if(this.userService.currentUser.isAdmin){
      this.router.navigateByUrl('/');
    }
    this.orderService.getOrdersByUserId(this.user.id).subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  parseDate(dateString: Date): Date {
    return new Date(dateString);
  }

  getCurrentDate(): Date {
    return new Date();
  }

}
