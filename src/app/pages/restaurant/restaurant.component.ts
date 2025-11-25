import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {

  constructor(private router: Router) { }

  back() {
    this.router.navigate(['/dashboard'])
  }

  ngOnInit(): void {
  }

}
