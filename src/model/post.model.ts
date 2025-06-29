export interface Post {
  id: number;
  instrument: string;
  description: string;
  year: number;
  username: string;
  date: string;
  name: string;
  likes?: Like;
}

export interface Like {
  count: number;
  users: string[];
}
