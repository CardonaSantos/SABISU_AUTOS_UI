export interface User {
  id: number;
  name: string;
  initials: string;
  avatar?: string;
}

export interface Comment {
  user: User;
  text: string;
  date: string;
  isPrivate?: boolean;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "nuevo" | "abierto" | "pendiente" | "solucionado";
  priority: "baja" | "media" | "alta" | "urgente";
  assignee: User;
  creator: User;
  date: string;
  unread?: boolean;
  tags?: string[];
  comments?: Comment[];
}
