import { Api } from "../base/Api";
import { IProduct, IOrderRequest, IOrderResponse } from "../../types";

export class ShopApi {
  constructor(private api: Api) { }

  getProducts(): Promise<IProduct[]> {
    return this.api
      .get<{ items: IProduct[] }>("/product/")
      .then((response) => response.items);
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", order);
  }
}
