import { Task } from "./Task";

export interface Project {
  id?: string;
  title: string;
  slug: string;
  color?: string;
  isActive?: boolean;
  createdAt?: Date;
  userId?: string;
  tasks?: Task[];
}
