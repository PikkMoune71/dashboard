export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  bio?: string;
  phone?: string;
  calendarToken?: string;
}
