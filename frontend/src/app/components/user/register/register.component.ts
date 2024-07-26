import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form!:FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:'',
      display_name:'',
      email:'',
      password:'',
      gender:'',

      })
  }
  
  ValidateEmail = (email: any) => {
  
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
    if(email.match(validRegex)){
      return true;
    }else{
      return false;
    }
  }

  // register(){

  //   let register =  this.form.getRawValue();
  //   console.log(register);

  // if(register.name == '' || register.display_name == '' || register.email == '' || register.password == '' || register.gender == '' )
  // {
  //   Swal.fire('Error', 'Please Enter all Fields!', 'error')
  // }

  // else if(!this.ValidateEmail(register.email))
  // {
  //   Swal.fire('Error', 'Please Enter valid Email!', 'error')
  // }
  // else{
  //   this.http.post(`${environment.apiWithoutOauth}/user`, register,{
  //     withCredentials:true
  //   }).subscribe(() => {
  //     this.router.navigate(['/login']), (e:any) => {
  //     Swal.fire('Error', e.error.message, 'error')
  //    }
  //   })
  // }
  // }

}
