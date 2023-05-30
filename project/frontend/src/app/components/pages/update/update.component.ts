import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FoodService } from 'src/app/services/food.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent {

  updateForm!: FormGroup;
  isSubmitted = false;
  food!: Food;

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private formBuilder: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private toastrService: ToastrService,
    private userService: UserService
  ) {

    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.foodService.getFoodById(params.id).subscribe((serverFood) => {
          this.food = serverFood;
          this.initializeForm();
        });
      }
    });

  }
  
  ngOnInit(): void {
    if(!this.userService.currentUser.isAdmin){
      this.router.navigateByUrl('/');
    }
    this.initializeForm();
  }
  
  initializeForm() {
    
    this.updateForm = this.formBuilder.group({
      name: [this.food.name, Validators.required],
      price: [this.food.price, [Validators.required, Validators.pattern(/^\d+$/)]],
      description: [this.food.description, [Validators.required, Validators.minLength(5)]],
      preparationTime: [this.food.preparationTime, [Validators.required, Validators.pattern(/^\d+$/)]],
      imageUrl: [this.food.imageUrl, Validators.required],
    });

  }  

  get f() {
    return this.updateForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.updateForm.invalid) return;
  
    const formData = this.updateForm.value;

    this.food = {
      id: this.food.id,
      name: formData.name,
      price: formData.price,
      description: formData.description,
      preparationTime: formData.preparationTime,
      imageUrl: formData.imageUrl,
      totalPrice: 0,
      totalQuantity: 0,
    };
  
    this.foodService.updateFood(this.food.id,this.food).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  deleteFood() {
    this.foodService.deleteFood(this.food.id).subscribe(
      () => {
        this.toastrService.success('Étel sikeresen törölve.');
        this.router.navigateByUrl('/');
      },
      (errorResponse) => {
        this.toastrService.error(errorResponse, 'Valami hiba történt!');
      }
    );
  }
  

}
