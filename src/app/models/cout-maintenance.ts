import { Equipement } from './equipement';

export interface CoutMaintenance {
  id: number;
  equipement: Equipement;
  cost: number;
  date: string;
  description: string;
}
