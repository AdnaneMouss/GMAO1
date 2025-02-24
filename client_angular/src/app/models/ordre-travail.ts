import { Equipement } from './equipement';
import { User } from './user';

export interface OrdreTravail {
  id: number;
  description: string;
  dateCreation: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  equipement: Equipement;
  assignedTo: User;
}
