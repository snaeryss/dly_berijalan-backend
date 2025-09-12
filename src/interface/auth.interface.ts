export interface ILoginResponse {
    token: string;
    admin: {
        id: number;
        username: string;
        email: string;
        name: string;
    };
}

export interface IRegisterResponse {
    token: string;
    admin: {
        id: number;
        username: string;
        email: string;
        name: string;
    };
}

export interface IUpdateResponse {
  admin: {
    id: number;
    username: string;
    email: string;
    name: string;
  };
}

export interface IDeleteResponse {
  admin: {
    id: number;
    username: string;
    email: string;
    name: string;
  };
}