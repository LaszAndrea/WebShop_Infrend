import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {

  addForm!: FormGroup;
  isSubmitted = false;
  newFood!: Food;

  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
      if(!this.userService.currentUser.isAdmin){
        this.router.navigateByUrl('/');
      }
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      preparationTime: ['', Validators.required],
      imageUrl: ['', Validators.required],
    })

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get f() {
    return this.addForm.controls;
  }

  
  onSubmit() {
    this.isSubmitted = true;
    if (this.addForm.invalid) return;

    const formData = this.addForm.value;
    this.newFood = {
      id: '',
      name: formData.name,
      price: formData.price,
      description: formData.description,
      preparationTime: formData.preparationTime,
      imageUrl: formData.imageUrl,
      totalQuantity: 0,
      totalPrice: 0
    };

    this.foodService.addFood(this.newFood).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }

}
