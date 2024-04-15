export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
};
export type UserData = {
  user_id: string | null
  name: string | null;
  email: string | null;
};

export type UserCredential = {
  token: string;
  user: UserData;
};

export type NoteData = {
  note_id: number;
  title: string;
  content: string;
  privacy: string;
  created_at: string;
  updated_at: string;
}

export type AuthContextType = {
  authState: UserCredential;
  setUserAuthInfo: (data: UserCredential) => void;
  isUserAuthenticated: () => boolean;
};
