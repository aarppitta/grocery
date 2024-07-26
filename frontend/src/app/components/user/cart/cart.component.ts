import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems:any = [];
  constructor(private http:HttpClient, private router:Router, private cartService:CartService) { }


  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`${environment.apiUrl}/cart`, { headers })
    .subscribe(data => {
      console.log("getting response",data);
      this.cartItems = data.data;
      this.cartService.changeCartItems(data);
    

    },(e)=>{
      console.log(e);
    })
  }

  deleteCartItem(id:string){
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete<any>(`${environment.apiUrl}/cart/${id}`, { headers })
    .subscribe(data => {
      console.log("getting response",data);
      this.cartItems = this.cartItems.filter((item:any) => item._id !== id);
      this.cartService.changeCartItems(this.cartItems);
    },(e)=>{
      console.log(e);
    })
  }

  updateCartItem(id: string, quantity: number){
    const token= localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }

    const headers = { Authorization: `Bearer ${token}` };


    this.http.put<any[]>(`${environment.apiUrl}/cart/${id}`, {quantity: quantity}, { headers })
      .subscribe((data) => {
    this.cartService.getCartItems();
    this.cartService.incrementNotificationCount();

    this.cartItems.forEach((item: any) => {
      if (item._id === id) {
        item.quantity = quantity;
      }
    });
      console.log('Data fetched successfully', data);
      }, (error) => {
      console.error('Error fetching data', error);
      });
  }

  subTotal() {
    if (Array.isArray(this.cartItems)) {
      return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    } else {
      return 0;
    }
  }
}
