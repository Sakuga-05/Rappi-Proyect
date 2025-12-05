import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { Menu } from 'src/app/models/menu.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { Order } from 'src/app/models/order.model';
import { CustomerService } from 'src/app/services/customer.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  form: FormGroup;
  id?: number;
  customers: Customer[] = [];
  motorcycles: Motorcycle[] = [];
  selectedMenu?: Menu;
  isView: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: OrderService,
    private customerService: CustomerService,
    private motorcycleService: MotorcycleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.configFormGroup();
  }

  configFormGroup() {
    this.form = this.fb.group({
      customer_id: ['', Validators.required],
      motorcycle_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.customerService.getAll().subscribe(data => this.customers = data);
    this.motorcycleService.getAll().subscribe(data => this.motorcycles = data);
    console.log(this.motorcycles)
    // Read selected menu passed via navigation state (from menu client)
    const stateMenu = (history && (history as any).state) ? (history as any).state.selectedMenu : null;
    if (stateMenu) {
      this.selectedMenu = stateMenu as Menu;
    }

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        this.isView = this.router.url.includes('/view/');
        this.service.getById(this.id).subscribe(o => {
          this.form.patchValue(o);
          if (this.isView) this.form.disable();
        });
      }
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const formValue = this.form.value as any;
    const order: Order = { ...(formValue as Order) } as Order;

    // If user came from a menu, attach menu_id and compute total
    if (this.selectedMenu) {
      order.menu_id = this.selectedMenu.id;
      const qty = Number(formValue.quantity) || 1;
      order.total = (Number(this.selectedMenu.price || 0) * qty);
    }

    if (this.id) {
      order.id = this.id;
      this.service.update(order).subscribe(() => {
        // reproducir sonido y dejar 300ms para que suene antes de navegar
        this.playSaveSound();
        setTimeout(() => {
          Swal.fire('Actualizado','OK','success');
          this.router.navigate(['/orders/list']);
        }, 300);
      });
    } else {
      this.service.create(order).subscribe(() => {
        // reproducir sonido y dejar 300ms para que suene antes de navegar
        this.playSaveSound();
        setTimeout(() => {
          Swal.fire('Creado','OK','success');
          this.router.navigate(['/orders/list']);
        }, 300);
      });
    }
  }

  // Reproduce un beep corto usando WebAudio (compatible con la mayoría de navegadores)
  playSaveSound() {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 660; // frecuencia en Hz (tono más grave que el beep del menú)
      // envelope: inicio suave, pico, y desvanecimiento
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.12, now + 0.01);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now);
      // duración total ~500ms
      g.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      try {
        o.stop(now + 0.51);
      } catch (e) { }
      // cerrar contexto unos ms después
      setTimeout(() => {
        if (ctx.close) ctx.close();
      }, 620);
    } catch (err) {
      console.warn('Audio not available', err);
    }
  }
}
