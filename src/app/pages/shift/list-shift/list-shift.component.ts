import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Shift } from 'src/app/models/shift.model';
import { DriverService } from 'src/app/services/driver.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { ShiftService } from 'src/app/services/shift.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-shift',
  templateUrl: './list-shift.component.html',
  styleUrls: ['./list-shift.component.scss']
})
export class ListShiftComponent implements OnInit {
  shifts: Shift[] = [];
  driverMap: { [id: number]: string } = {};
  motorcycleMap: { [id: number]: string } = {};

  constructor(
    private service: ShiftService,
    private driverService: DriverService,
    private motorcycleService: MotorcycleService
  ) { }

  ngOnInit(): void {
    forkJoin({
      drivers: this.driverService.getAll(),
      motorcycles: this.motorcycleService.getAll()
    }).subscribe(({ drivers, motorcycles }) => {
      drivers.forEach(d => this.driverMap[d.id] = d.name || `#${d.id}`);
      motorcycles.forEach(m => this.motorcycleMap[m.id] = m.license_plate || `#${m.id}`);
      this.load();
    }, (err) => {
      console.error('Error loading maps', err);
      this.load();
    });
  }

  load() {
    this.service.getAll().subscribe(data => this.shifts = data);
  }

  getDriverName(id: number) {
    return this.driverMap[id] ?? `#${id}`;
  }

  getMotorcyclePlate(id: number) {
    return this.motorcycleMap[id] ?? `#${id}`;
  }

  deleteShift(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro de eliminar el turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire('Eliminado', 'Turno eliminado correctamente', 'success');
          this.load();
        });
      }
    });
  }
}
