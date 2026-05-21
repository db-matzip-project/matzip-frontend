export type User = {
  id: string;
  name: string;
  username: string;
  phone: string;
  password: string;
  preferences: string[];
};

export type PublicUser = Omit<User, 'password'>;
