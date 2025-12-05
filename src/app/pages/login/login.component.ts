import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: User

  constructor(private securityService: SecurityService, private router: Router) {
    this.user = { email: "", password: "" };
  }

  //Login por Usuario/Contraseña
  logIn() {
    console.log("Intentando login:", this.user);

    this.securityService.login(this.user).subscribe({
      next: (data) => {
        console.log("Firebase login:", data);
        this.securityService.setSessionUser(data.user);
        Swal.fire({
          title: "Inicio de sesión exitoso",
          text: "Bienvenido/a al sistema",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(["dashboard"]);
        });
      },
      error: (error) => {
        console.error("Login error:", error);

        Swal.fire(
          "Autenticación Inválida",
          "Usuario o contraseña incorrectos",
          "error"
        );
      },
    });
  }

  //Login por Google
  LogInGoogle() {
    this.securityService.loginWithGoogle()
    .then(() => {
      Swal.fire({
        title: "Inicio de sesión exitoso",
        text: "Has iniciado sesión con Google",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(["dashboard"]);
      });
    })
    .catch(err => {
      console.error(err);
      Swal.fire("Error", "No se pudo iniciar sesión con Google", "error");
    });
  }

  //Login por GitHub
  LogInGitHub() {
    this.securityService.loginWithGitHub()
    .then(() => {
      Swal.fire({
        title: "Inicio de sesión exitoso",
        text: "Has iniciado sesión con GitHub",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(["dashboard"]);
      });
    })
    .catch(err => {
      console.error(err);
      Swal.fire("Error", "No se pudo iniciar sesión con GitHub", "error");
    });
  }

  //Login por Microsoft
  LogInMicrosoft() {
    this.securityService.loginWithMicrosoft()
    .then(() => {
      Swal.fire({
        title: "Inicio de sesión exitoso",
        text: "Has iniciado sesión con Microsoft",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(["dashboard"]);
      });
    })
    .catch(err => {
      console.error(err);
      Swal.fire("Error", "No se pudo iniciar sesión con Microsoft", "error");
    });
  }


  ngOnInit(): void {
  }
  ngOnDestroy() {
  }

}
