import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare var $: any; // If you're using jQuery
@Component({
  selector: 'app-productcategory',
  templateUrl: './productcategory.component.html',
  styleUrls: ['./productcategory.component.css']
})
export class ProductcategoryComponent implements OnInit {

  categories: any[] = [];
  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
    }
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`${environment.apiUrl}/category`, { headers }).subscribe(response => {
      console.log("getting response",response);
      this.categories = response.data;
      console.log(this.categories);

      // datatable
      $(document).ready(function() {
        $('#productTable').DataTable({
          "pagingType": "full_numbers",
          scrollX: true,
        
          "pageLength": 5,
          "lengthMenu": [5, 10, 15, 20],
          responsive: true,
           // Define the buttons to be included
           dom: 
           "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6 text-end'<'search-wrap'f>>>" +
           "<'row'<'col-sm-12'tr>>" +
           "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        
  // This needs to be added to define the position of the buttons
          buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'],
            columns: [
              { width: "25%" }, // Example: Set width for each column
              { width: "25%" },
              { width: "25%" },
              { width: "25%" },
              { width: "25%" }
            ],
        });
      });
    
    })
  }

  editCategory(category:any){
    console.log(category);
    this.router.navigate(['/productcategory_update', category.category_id], { state: { category: category } });
  }

  deleteCategory(category:any){
    const token = localStorage.getItem('token');
    if(!token){
      this.router.navigate(['/login']);
    }
    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete<any>(`${environment.apiUrl}/category/${category.category_id}`, { headers }).subscribe({
      next: (data) => {
        console.log("getting response",data);
        this.categories = this.categories.filter((item) => item.category_id !== category.category_id);
      },
      error: (error) => {
        console.log("Error deleting category:",error);
      }
    });
  }
}
