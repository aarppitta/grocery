import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare var $: any; // If you're using jQuery

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {
  
  products: any[] = [];
  
  
  constructor(private http:HttpClient, private router:Router) { }

  
  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
    }
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`${environment.apiUrl}/product`, { headers }).subscribe(response => {
      console.log("getting response",response);
      this.products = response.data;
      console.log(this.products);

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
            'copy', 'csv', 'excel', 'pdf', 'print'
          ]
              
        });
    
      });
    });
  }

  editProduct(product:any){
    console.log(product);
    this.router.navigate(['/productlist_update', product.product_id], { state: { product: product } });
  }


  deleteProduct(product:any){
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
    }
    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete<any>(`${environment.apiUrl}/product/${product.product_id}`, { headers }).subscribe({
      next: (data) => {
        console.log('Data fetched successfully', data);
        // delete product from products array
        this.products = this.products.filter((item) => item.product_id !== product.product_id);
      },
      error: (error) => {
        console.error('Error fetching data', error);
      }
    });

  }
}

