import { Equipement } from './equipement';
import { User } from './user';

export interface Rapport {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  equipement: Equipement;
  createdBy: User;
}
