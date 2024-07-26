import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-productcategory-update',
  templateUrl: './productcategory-update.component.html',
  styleUrls: ['./productcategory-update.component.css']
})
export class ProductcategoryUpdateComponent implements OnInit {
  updateCategoryForm!:FormGroup;
  id:any;
  category:any;

  constructor(
    private formBuilder:FormBuilder, 
    private router:Router, 
    private http:HttpClient,
    private route: ActivatedRoute) {

      this.updateCategoryForm = this.formBuilder.group({
        name: ['', Validators.required],
        image:['', Validators.required],
        description: ['', Validators.required],
      });
     }
  
  ngOnInit(): void {


    this.id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${environment.apiUrl}/category/${this.id}`, { headers }).subscribe((data:any) => {
      console.log("getting response",data);
      this.category = data.data;
      this.updateCategoryForm.setValue({
        name: this.category.name,
        image: null,
        description: this.category.description,
      });
    });
   
  }

  update_category(event:Event, category:any){

    if(this.updateCategoryForm.valid){
      const categoryData = this.updateCategoryForm.getRawValue();
      console.log(categoryData);

      categoryData.image = this.category.image;
      const token = localStorage.getItem('token');

      if(!token){
        this.router.navigate(['/login']);
      }
      const headers = { Authorization: `Bearer ${token}` };
      this.http.patch(`${environment.apiUrl}/category/${this.id}`, categoryData, { headers }).subscribe((data:any) => {
        console.log("getting response",data);
        this.router.navigate(['/productcategory']);
      }, (error) => {
        console.log("Error updating user:",error);
      });
    }
  }

}
