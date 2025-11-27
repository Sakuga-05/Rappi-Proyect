import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${environment.url_backend}/issues`);
  }

  getById(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${environment.url_backend}/issues/${id}`);
  }

  create(issue: Issue): Observable<Issue> {
    delete issue.id;
    return this.http.post<Issue>(`${environment.url_backend}/issues`, issue);
  }

  update(issue: Issue): Observable<Issue> {
    return this.http.put<Issue>(`${environment.url_backend}/issues/${issue.id}`, issue);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_backend}/issues/${id}`);
  }
}
