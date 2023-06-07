import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/Food';
import { User } from 'src/app/shared/models/User';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css',]
})
export class HomeComponent implements OnInit {

  user!: User;
  foods: Food[] = [];

  constructor(private foodService: FoodService, private activatedRoute: ActivatedRoute, private userService: UserService){

    let foodsObservable: Observable<Food[]>;

    activatedRoute.params.subscribe((params =>{
      if(params.searched){
        foodsObservable = this.foodService.getAllFoodsBySearch(params.searched);
      }
      else{
        foodsObservable = foodService.getAll();
      }

      foodsObservable.subscribe((serverFoods) =>{
        this.foods = serverFoods;
      })

    }))
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const searched = params.searched;
      let foodsObservable: Observable<Food[]>;

      if (searched) {
        foodsObservable = this.foodService.getAllFoodsBySearch(searched);
      } else {
        foodsObservable = this.foodService.getAll();
      }

      foodsObservable.subscribe(serverFoods => {
        this.foods = serverFoods;
      });
    });
  }

  getPreparationTime(food: Food): Food {
    
    if (food.name.toLowerCase().includes('pizza')) {
      food.preparationTime = 20;
      return food;
    } else {
      return food;
    }

  }

  get isAdmin(){
    this.user = this.userService.currentUser;
    return this.user.isAdmin;
  }

  get isAuth(){
    this.user = this.userService.currentUser;
    return this.user.name;
  }

}
