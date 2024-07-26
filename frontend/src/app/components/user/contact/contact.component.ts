import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  form!:FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private http:HttpClient,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fname:'',
      lname:'',
      email:'',
      message:''
    })
  }

  ValidateEmail = (email: any) => {
    var validaRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if(email.match(validaRegex)){
      return true;
    }
    else{
      return false;
    }
  }

  contact(){
    let contact = this.form.getRawValue();
    console.log(contact);

    if(contact.fname == '' || contact.lname == '' || contact.email == '' || contact.message == '')
      {
      Swal.fire('Error','Please fill all the fields','error');
      }
      else if(!this.ValidateEmail(contact.email)){
        Swal.fire('Error','Please enter a valid email','error');
      }
      else{
        this.http.post(`${environment.apiWithoutOauth}/contact`, contact,{
          withCredentials:true
        }).subscribe(() => {
          this.router.navigate(['/']), (e:any) => {
          Swal.fire('Error', e.error.message, 'error')
         }
        })
      }
  }
}
