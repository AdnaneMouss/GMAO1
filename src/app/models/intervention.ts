import { OrdreTravail } from './ordre-travail';
import { User } from './user';

export interface Intervention {
  id: number;
  date: string;
  description: string;
  ordreTravail: OrdreTravail;
  technician: User;
}
