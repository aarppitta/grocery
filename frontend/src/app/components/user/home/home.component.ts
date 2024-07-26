import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products:any = [];
  constructor(
    private http:HttpClient,
    private router:Router, 
    private cartService:CartService
    
  ) { }

  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`${environment.apiUrl}/product`, { headers }).subscribe(response => {
      console.log("getting response",response);
      this.products = response.data;
    })
  }

  addToCart(product:any, quantity:number){
    const token = localStorage.getItem('token');
    if(!token){
      this.router.navigate(['/login']);
    }
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post<any>(`${environment.apiOauth}/cart`, { product_id: product._id, quantity: quantity}, { headers }).subscribe(cart => {
      console.log("getting response",cart);
      this.cartService.incrementNotificationCount();
      this.cartService.showNotification.next(true);
    },
    (e)=>{
      console.log(e);
    }
  )
  }

}
