export interface User {
  id: number;
  nom: string;
  civilite: 'M' | 'Mme' | 'Mlle' | 'Dr' | 'Pr'; // Civilite avec des valeurs possibles
  email: string;
  username: string;
  password: string;
  gsm: string;
  image?: string;
  role: 'ADMIN' | 'RESPONSABLE' | 'TECHNICIEN' | 'MAGASINIER' | 'LAMBDA'; // Role avec des valeurs possibles
  actif: boolean;
  dateInscription: string;
}
