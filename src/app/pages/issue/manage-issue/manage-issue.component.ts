import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from 'src/app/models/issue.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { Photo } from 'src/app/models/photo.model';
import { IssueService } from 'src/app/services/issue.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { PhotoService } from 'src/app/services/photo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-issue',
  templateUrl: './manage-issue.component.html',
  styleUrls: ['./manage-issue.component.scss']
})
export class ManageIssueComponent implements OnInit {
  form!: FormGroup;
  motorcycles: Motorcycle[] = [];
  id?: number;
  editMode = false;
  viewMode = false;
  existingPhotos: Photo[] = [];
  newPhotos: { file: File, preview: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private service: IssueService,
    private photoService: PhotoService,
    private motorcycleService: MotorcycleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.configFormGroup();

    this.motorcycleService.getAll().subscribe(data => this.motorcycles = data);

    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      const path = this.route.snapshot.url[0]?.path;
      this.editMode = path === 'update';
      this.viewMode = path === 'view';

      this.service.getById(this.id).subscribe(issue => {
        this.form.patchValue({
          motorcycle_id: issue.motorcycle_id,
          issue_type: issue.issue_type,
          description: issue.description,
          status: issue.status,
          date_reported: this.formatDate(issue.date_reported)
        });

        if (issue.photos) {
          this.existingPhotos = issue.photos;
        }

        if (this.viewMode) {
          this.form.disable();
        }
      });
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onFileSelect(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let file of event.target.files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.newPhotos.push({ file, preview: e.target.result });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  configFormGroup() {
    this.form = this.fb.group({
      motorcycle_id: [0, [Validators.required, Validators.min(1)]],
      issue_type: ['', Validators.required],
      description: ['', Validators.required],
      status: ['reported', Validators.required],
      date_reported: ['', Validators.required]
    });
  }

  removeNewPhoto(index: number) {
    this.newPhotos.splice(index, 1);
  }

  removeExistingPhoto(photo: Photo) {
    Swal.fire({
      title: 'Eliminar Foto',
      text: '¿Está seguro de eliminar esta foto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.photoService.delete(photo.id).subscribe(() => {
          this.existingPhotos = this.existingPhotos.filter(p => p.id !== photo.id);
          Swal.fire('Eliminado', 'Foto eliminada correctamente', 'success');
        });
      }
    });
  }

  save() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const issue: Issue = this.form.value;

    if (this.editMode && this.id) {
      issue.id = this.id; // asignar id antes de actualizar
      this.service.update(issue).subscribe(() => {
        this.uploadNewPhotos(this.id!);
      });
    } else {
      this.service.create(issue).subscribe(created => {
        this.uploadNewPhotos(created.id);
      });
    }
  }

  uploadNewPhotos(issueId: number) {
    if (this.newPhotos.length === 0) {
      Swal.fire('Éxito', 'Inconveniente guardado correctamente', 'success');
      this.router.navigate(['/issues/list']);
      return;
    }

    // Simulación de carga de fotos - en producción usar FormData multipart
    let uploaded = 0;
    this.newPhotos.forEach((photoData, index) => {
      const nowIso = new Date().toISOString();
      const photo: Photo = {
        id: 0,
        issue_id: issueId,
        image_url: `/uploads/issue_${issueId}_photo_${Date.now()}_${index}.jpg`,
        caption: `Foto ${index + 1}`,
        taken_at: nowIso,
        created_at: nowIso
      };

      this.photoService.create(photo).subscribe(() => {
        uploaded++;
        if (uploaded === this.newPhotos.length) {
          Swal.fire('Éxito', 'Inconveniente y fotos guardadas correctamente', 'success');
          this.router.navigate(['/issues/list']);
        }
      });
    });
  }

  cancel() {
    this.router.navigate(['/issues/list']);
  }
}
