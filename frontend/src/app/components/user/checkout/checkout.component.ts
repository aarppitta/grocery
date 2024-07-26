import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartItems!: any[];
  checkoutForm!: FormGroup;
  
  constructor(private http:HttpClient, private formBuilder:FormBuilder, private router:Router) { }


  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }

    const headers = { 'Authorization': 'Bearer ' + token };

    this.http.get<any[]>(`${environment.apiUrl}/cart`, { headers })
    .subscribe((data) => {
    this.cartItems = data;
    console.log('Data fetched successfully', data);
    }, (error) => {
    console.error('Error fetching data', error);
    });

    this.checkoutForm = this.formBuilder.group({
      name:'',
      display_name:'',
      address_line_1:'',
      address_line_2:'',
      pincode:'',
      email:'',
      mobile:''
    });
  }

  subTotal(){   
    if(this.cartItems){
      return this.cartItems.reduce((acc: any, item: any) => acc + item.product.price * item.quantity, 0);
    }
    return 0;
  }

 
  placeOrder(){
    const order = {
      name : this.checkoutForm.value.name,
      display_name : this.checkoutForm.value.display_name,
      address_line_1 : this.checkoutForm.value.address_line_1,
      address_line_2 : this.checkoutForm.value.address_line_2,
      pincode : this.checkoutForm.value.postcode,
      email : this.checkoutForm.value.email,
      mobile : this.checkoutForm.value.mobile,
      country: this.checkoutForm.value.country,
      totalPrice: this.subTotal(),
      orderItems: this.cartItems.map((item: any) => {
        return {
          product: item.product._id,
          quantity: item.quantity
        }
      })
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.post(`${environment.apiUrl}/order`, order, { headers })
    .subscribe((order)=>{
    
    this.http.delete(`${environment.apiUrl}/cart`, { headers })
    .subscribe((data) => {
      console.log('Data fetched successfully', data);
      Swal.fire("Order Placed Successfully", "Thank you for shopping with us", "success");
      }, (error) => {
      console.error('Error fetching data', error);
      });
    console.log(order);
    }
    );
  }

}
