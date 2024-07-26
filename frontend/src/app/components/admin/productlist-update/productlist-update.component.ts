import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-productlist-update',
  templateUrl: './productlist-update.component.html',
  styleUrls: ['./productlist-update.component.css']
})
export class ProductlistUpdateComponent implements OnInit {

  updateform!:FormGroup;
  product:any;
  id:any;

  constructor(
    private http:HttpClient, 
    private formBuilder:FormBuilder, 
    private router:Router, 
    private route: ActivatedRoute) { 

    this.updateform = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      specifications: ['', Validators.required],
      image: ['', Validators.required],
      stock: ['', Validators.required],
      isFeatured: ['', Validators.required],
    });
    }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${environment.apiUrl}/product/${this.id}`, { headers }).subscribe((data:any) => {
      console.log("getting response",data);
      this.product = data.data;
      this.updateform.setValue({
        name: this.product.name,
        price: this.product.price,
        description: this.product.description,
        specifications: this.product.specifications,
        image: null,
        stock: this.product.stock,
        isFeatured: this.product.isFeatured,
        });
      /*
      this.updateform = this.formBuilder.group({
        name: [this.product.name, Validators.required],
        price: [this.product.price, Validators.required],
        description: [this.product.description, Validators.required],
        specifications: [this.product.specifications, Validators.required],
        image: ['', Validators.required],
        stock: [this.product.stock, Validators.required],
        isFeatured: [this.product.isFeatured, Validators.required],
      });
      */
    });
  }

  updateProduct(event:Event, product:any){
    if(this.updateform.valid){
      const updatedProduct = this.updateform.value;
      console.log("updatedProduct",updatedProduct);
      updatedProduct.image = this.product.image;
      const token = localStorage.getItem('token');

      if(!token){
        this.router.navigate(['/login']);
      }
      const headers = { Authorization: `Bearer ${token}` };
      this.http.patch(`${environment.apiUrl}/product/${this.id}`, updatedProduct, { headers }).subscribe((response:any) => {
        console.log("response",response);
        this.router.navigate(['/productlist']);
      }, (error) => {
        console.log("Error updating user:",error);
      }
    );
    }
  }

  
}
