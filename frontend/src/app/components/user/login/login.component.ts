import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!:FormGroup;

  constructor(private formBuilder:FormBuilder,private http:HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: ''
    }); 
  }

  login(){
    let body = {
      email: this.form.value.email,
      password: this.form.value.password,
      strategy: 'password',
    };
    this.http.post(`${environment.apiOauth}`, body).subscribe((data:any)=>{

      // Store the token in local storage
     localStorage.setItem('token', data.token);

     if(data.display_name == 'test'){
      this.router.navigate(['/admin_home']);
      Swal.fire('Success', 'You are logged in as a Admin', 'success');
     }else{
      this.router.navigate(['/']);
      Swal.fire('Success', 'You are logged in', 'success');
     }
      console.log(data);
    });
    }
    
  }


