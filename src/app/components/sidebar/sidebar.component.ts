import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/restaurante', title: 'Restaurante',  icon:'ni-shop text-pink', class: '' },
    { path: '/users', title: 'Usuarios',  icon:'ni-single-02 text-orange', class: '' },
    { path: '/chatbot', title: 'Asistente', icon: 'ni-chat-round text-info', class: '' },
    { path: '/graficas', title: 'Graficas',  icon:'ni-ui-04 text-danger', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
