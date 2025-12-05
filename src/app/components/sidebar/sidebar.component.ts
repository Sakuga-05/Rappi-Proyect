import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/restaurante', title: 'Restaurante',  icon:'ni-shop text-pink', class: '' },
    { path: '/users', title: 'Usuarios',  icon:'ni-single-02 text-orange', class: '' },
    { path: '/orders/list', title: 'Pedidos',  icon:'ni-cart-simple text-red', class: '' },
    { path: '/addresses/list', title: 'Direcciones',  icon:'ni-pin-3 text-yellow', class: '' },
    { path: '/motorcycles/list', title: 'Motocicletas',  icon:'ni-delivery-fast text-blue', class: '' },
    { path: '/drivers/list', title: 'Conductores',  icon:'ni-circle-08 text-green', class: '' },
    { path: '/shifts/list', title: 'Turnos',  icon:'ni-time-alarm text-purple', class: '' },
    { path: '/issues/list', title: 'Inconvenientes',  icon:'ni-ui-04 text-danger', class: '' },
    { path: '/chatbot', title: 'Asistente', icon: 'ni-chat-round text-info', class: '' },
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
