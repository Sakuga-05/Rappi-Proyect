import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motorcycle',
  templateUrl: './motorcycle.component.html',
  styleUrls: ['./motorcycle.component.scss']
})
export class MotorcycleComponent implements OnInit {

  constructor(private router: Router) { }

  back() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
  }

}
