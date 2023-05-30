import { Injectable } from '@angular/core';
import { Food } from '../shared/models/Food';
import { HttpClient } from '@angular/common/http';
import { FOODS_BY_ID_URL, FOODS_BY_SEARCH_URL, FOODS_URL } from '../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Food[]>{
    return this.http.get<Food[]>(FOODS_URL);
  };

  getAllFoodsBySearch(searched:string){
      return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searched);  
  };

  getFoodById(foodId:number):Observable<Food>{
    return this.http.get<Food>(FOODS_BY_ID_URL + foodId);  
  };

  getFoodByIdString(foodId: string): Observable<Food> {
    return this.http.get<Food>(FOODS_BY_ID_URL + foodId);
  }

  addFood(food: Food): Observable<Food> {
    return this.http.post<Food>(FOODS_URL, food);
  }

  updateFood(foodId: string, food: Food): Observable<any> {
    return this.http.put(FOODS_BY_ID_URL + foodId, food);
  }

  deleteFood(foodId: string): Observable<Food> {
    return this.http.delete<Food>(FOODS_URL + '/'  + foodId);
  }

  
}
