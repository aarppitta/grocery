import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  users!: any[];
  id!:''

  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit(): void {

    
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
    }
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`${environment.apiUrl}/user`, { headers }).subscribe(user => {
      console.log(user);
      this.users = user.users;
      console.log('Users:', this.users);
      console.log('Data fetched successfully', user);
   },
   (error) => {
    console.error('There was an error!', error);
  });
   
  }

  deleteUser(id:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${environment.apiUrl}/user/${id}`, { headers }).subscribe((data:any)=>{
      console.log(data);
      this.router.navigate(['/userlist']);
    });
  }

}
