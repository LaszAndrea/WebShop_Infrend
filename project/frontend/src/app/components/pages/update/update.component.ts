import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
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
    private router: Router
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
    this.initializeForm();
  }
  
  initializeForm() {
    
    this.updateForm = this.formBuilder.group({
      name: [this.food.name, Validators.required],
      price: [this.food.price, Validators.required],
      description: [this.food.description, [Validators.required, Validators.minLength(5)]],
      preparationTime: [this.food.preparationTime, Validators.required],
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
  

}
