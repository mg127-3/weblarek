export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: "card" | "cash" | "";
  email: string;
  phone: string;
  address: string;
}

export interface IOrderRequest {
  items: string[];
  payment: 'card' | 'cash';
  address: string;
  email: string;
  phone: string;
  total: number;
}


export interface IOrderResponse {
  success: boolean;
  total: number;
}
