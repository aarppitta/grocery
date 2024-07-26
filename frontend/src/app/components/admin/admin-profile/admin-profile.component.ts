import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  profileForm!:FormGroup;
  id:any;
  profile:any;

  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private http:HttpClient,
    private route: ActivatedRoute
  ) { 
    this.profileForm = this.formBuilder.group({
      name: [{value: '', disabled: true}, Validators.required],
      email: [{value: '', disabled: true}, Validators.required],
      password: [{value: '', disabled: true}, Validators.required],
      display_name: [{value: '', disabled: true}, Validators.required],
      gender:[{value: '', disabled: true}, Validators.required]
    });
  }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`${environment.apiUrl}/user/${this.id}`, { headers }).subscribe(data => {
      console.log("getting response",data);
      this.profile = data.data;

      this.profileForm.setValue({
        name: this.profile.name,
        email: this.profile.email,
        password: this.profile.password,
        display_name: this.profile.display,
        gender: this.profile.gender
      })
  });
  }
  
  updateProfile(profile:any){

    if(this.profileForm.valid){
      const profileData = this.profileForm.getRawValue();
      console.log(profileData);

      const token = localStorage.getItem('token');

      if(!token){
        this.router.navigate(['/login']);
    }
    const headers = { Authorization: `Bearer ${token}` };

    this.http.patch(`${environment.apiUrl}/user/${this.id}`, profileData, { headers }).subscribe((data:any) => {
      console.log("getting response",data);
      this.router.navigate(['/admin_home']);
    }, (error) => {
      console.log("error",error);
    });
  }
  }
}
