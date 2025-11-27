import { Motorcycle } from './motorcycle.model';
import { Photo } from './photo.model';

export class Issue {
  id: number;
  motorcycle_id: number;
  issue_type: string; // accident, maintenance, flat_tire, etc.
  description: string;
  status: string; // reported, in_progress, resolved
  date_reported: string;
  created_at?: string;
  motorcycle?: Motorcycle;
  photos?: Photo[];
}
