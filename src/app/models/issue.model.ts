import { Motorcycle } from './motorcycle.model';
import { Photo } from './photo.model';

export class Issue {
  id: number;
  motorcycle_id?: number;
  description?: string;
  issue_type?: string; // accident, maintenance, flat_tire, etc.
  date_reported?: Date;
  status?: string; // reported, in_progress, resolved
  created_at?: string;
  motorcycle?: Motorcycle;
  
  photos?: Photo[];
}
