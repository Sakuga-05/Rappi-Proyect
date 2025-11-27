import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${environment.url_backend}/photos`);
  }

  getByIssueId(issueId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${environment.url_backend}/photos?issue_id=${issueId}`);
  }

  getById(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${environment.url_backend}/photos/${id}`);
  }

  create(photo: Photo): Observable<Photo> {
    delete photo.id;
    return this.http.post<Photo>(`${environment.url_backend}/photos`, photo);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_backend}/photos/${id}`);
  }
}
