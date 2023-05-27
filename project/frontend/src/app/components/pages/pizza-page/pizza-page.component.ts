import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-pizza-page',
  templateUrl: './pizza-page.component.html',
  styleUrls: ['./pizza-page.component.css']
})
export class PizzaPageComponent {

  food!: Food;

  constructor(activatedRoute: ActivatedRoute, foodService: FoodService, 
    private cartService: CartService, private router: Router, private userService: UserService){
      activatedRoute.params.subscribe((params) =>{
        if(params.id){
          foodService.getFoodById(params.id).subscribe(serverFood =>{
            this.food = serverFood;
          });
        }
      })
  }

  ngOnInit() {
    if(this.userService.currentUser.isAdmin){
      this.router.navigateByUrl('/');
    }
  }

  addToCart(){
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }

}
