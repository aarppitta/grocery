import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-productlist-add',
  templateUrl: './productlist-add.component.html',
  styleUrls: ['./productlist-add.component.css']
})
export class ProductlistAddComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(private formBuilder:FormBuilder, private htpp:HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:['', Validators.required],
      price:['', Validators.required],
      description:['', Validators.required],
      image:['', Validators.required],
      specifications:['', Validators.required],
      stock:['', Validators.required],
      isFeatured:['', Validators.required],
    })
  }

  add_product(){

    if(this.form.valid){
      let productData = this.form.getRawValue();
      console.log(productData);
      
      //change in future
      productData.image = productData.image.replace('C:\\fakepath\\', 'https://fastly.picsum.photos/id/504/200/');
      const token = localStorage.getItem('token');
      if(!token){
        this.router.navigate(['/login']);
      }
      const headers = { Authorization: `Bearer ${token}` };

      this.htpp.post<any>(`${environment.apiUrl}/product`, productData, { headers }).subscribe(product => {
        console.log(product);
        this.router.navigate(['/productlist']);
      },
      (error) => {
        console.error('There was an error!', error);
      });
    }
    
  }

}
