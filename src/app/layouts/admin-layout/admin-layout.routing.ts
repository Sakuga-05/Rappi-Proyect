import { Routes } from '@angular/router';

import { RestaurantComponent } from 'src/app/pages/restaurant/restaurant.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';


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
        {
            path: "restaurants",
            loadChildren: () =>
            import("src/app/pages/restaurant/restaurant.module").then(
                (m) => m.RestaurantModule
            ),
        },
        {
            path: "menus",
            loadChildren: () =>
            import("src/app/pages/menu/menu.module").then(
                (m) => m.MenuModule
            ),
        },
        {
            path: "users",
            loadChildren: () =>
            import("src/app/pages/user/user.module").then(
                (m) => m.UserModule
            ),
        },
        
        {
            path: "orders",
            loadChildren: () =>
            import("src/app/pages/order/order.module").then(
                (m) => m.OrderModule
            ),
        },
        {
            path: "addresses",
            loadChildren: () =>
            import("src/app/pages/address/address.module").then(
                (m) => m.AddressModule
            ),
        },
        {
            path: "motorcycles",
            loadChildren: () =>
            import("src/app/pages/motorcycle/motorcycle.module").then(
                (m) => m.MotorcycleModule
            ),
        },
        {
            path: "drivers",
            loadChildren: () =>
            import("src/app/pages/driver/driver.module").then(
                (m) => m.DriverModule
            ),
        },
        {
            path: "shifts",
            loadChildren: () =>
            import("src/app/pages/shift/shift.module").then(
                (m) => m.ShiftModule
            ),
        },
        {
            path: "issues",
            loadChildren: () =>
            import("src/app/pages/issue/issue.module").then(
                (m) => m.IssueModule
            ),
        },
        {
            path: "chatbot",
            loadChildren: () =>
            import("src/app/pages/chatbot/chatbot.module").then(
                (m) => m.ChatbotModule
            ),
        },
        ],
    },
];
