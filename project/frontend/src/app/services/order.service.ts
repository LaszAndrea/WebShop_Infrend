import { Injectable } from '@angular/core';
import { Order } from '../shared/models/Order';
import { HttpClient } from '@angular/common/http';
import { ORDERS_URL, ORDER_CREATE_URL } from '../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<any> {
    return this.http.post<any>(ORDER_CREATE_URL, order);
  }

  deleteOrder(userId: string): Observable<any> {
    return this.http.delete<any>(ORDERS_URL + '/' + userId);
  }  

  getOrder(): Observable<Order> {
    return this.http.get<Order>(ORDERS_URL);
  }

  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(ORDERS_URL + '/' + userId);
  }

  getOrderByUserId(userId: string): Observable<Order> {
    return this.http.get<Order>(ORDERS_URL + '/' + userId);
  }

}
