import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Issue } from 'src/app/models/issue.model';
import { IssueService } from 'src/app/services/issue.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-issue',
  templateUrl: './list-issue.component.html',
  styleUrls: ['./list-issue.component.scss']
})
export class ListIssueComponent implements OnInit {
  issues: Issue[] = [];
  motorcycleMap: { [id: number]: string } = {};

  constructor(
    private service: IssueService,
    private motorcycleService: MotorcycleService
  ) { }

  ngOnInit(): void {
    forkJoin({
      motorcycles: this.motorcycleService.getAll()
    }).subscribe(({ motorcycles }) => {
      motorcycles.forEach(m => this.motorcycleMap[m.id] = m.license_plate || `#${m.id}`);
      this.load();
    }, (err) => {
      console.error('Error loading motorcycles map', err);
      this.load();
    });
  }

  load() {
    this.service.getAll().subscribe(data => this.issues = data);
  }

  getMotorcyclePlate(id: number) {
    return this.motorcycleMap[id] ?? `#${id}`;
  }

  deleteIssue(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro de eliminar el inconveniente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire('Eliminado', 'Inconveniente eliminado correctamente', 'success');
          this.load();
        });
      }
    });
  }
}
