import { IProduct } from "../../types";

export class Products {
  private productList: IProduct[] = [];
  private item: IProduct | null = null;

  setProductList(products: IProduct[]): void {
    this.productList = [...products];
  }

  getProductList(): IProduct[] {
    return [...this.productList];
  }

  getItemById(id: string): IProduct | undefined {
    return this.productList.find((p) => p.id === id);
  }

  setItem(product: IProduct): void {
    this.item = product;
  }

  getItem(): IProduct | null {
    return this.item;
  }
}
