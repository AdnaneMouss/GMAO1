export interface Service {
  id: number;
  nom: string;
  description: string;
  image: string;
  actif: boolean;
  imageFile?: File;
}
