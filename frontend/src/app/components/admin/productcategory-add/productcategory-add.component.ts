import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-productcategory-add',
  templateUrl: './productcategory-add.component.html',
  styleUrls: ['./productcategory-add.component.css']
})
export class ProductcategoryAddComponent implements OnInit {

  form:FormGroup= new FormGroup({});
  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private http:HttpClient
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:['',Validators.required],
      description:['',Validators.required],
      image:['',Validators.required]
    })
  }

  add_category(){

    if(this.form.valid){
      let categoryDate = this.form.getRawValue();
      console.log(categoryDate);

      //change in future
      categoryDate.image = categoryDate.image.replace('C:\\fakepath\\', 'https://fastly.picsum.photos/id/504/200/');
      const token = localStorage.getItem('token');
      if(!token){
        this.router.navigate(['/login']);
      }
      const headers = { Authorization: `Bearer ${token}` };

      this.http.post<any>(`${environment.apiUrl}/category`, categoryDate, { headers }).subscribe(category => {
        console.log(category);
        this.router.navigate(['/productcategory']);
      },
      (error) => {
        console.error('There was an error!', error);
      });
    }
  }

}
