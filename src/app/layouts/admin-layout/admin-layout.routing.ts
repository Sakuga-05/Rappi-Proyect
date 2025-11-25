import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { RestaurantComponent } from 'src/app/pages/restaurant/restaurant.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'restaurante',      component: RestaurantComponent },
    {
        path: "",
        children: [
        {
            path: "products",
            loadChildren: () =>
            import("src/app/pages/product/product.module").then(
                (m) => m.ProductModule
            ),
        },
        ],
    },
];
