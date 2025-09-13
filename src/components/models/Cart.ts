import { IProduct } from "../../types";

export class Cart {
  private productsList: IProduct[] = [];

  setProductsList(products: IProduct[]): void {
    this.productsList = products;
  }

  getCartProductsList(): IProduct[] {
    return this.productsList;
  }

  addProductToCart(product: IProduct): void {
    if (this.getProductAvailability(product.id)) return;
    this.productsList.push(product);
  }

  removeProductFromCart(id: string): void {
    this.productsList = this.productsList.filter((p) => p.id !== id);
  }

  getCartProductQuantity(): number {
    return this.productsList.length;
  }

  getCartProductPrice(): number {
    return this.productsList.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  getProductAvailability(id: string): boolean {
    return this.productsList.some((p) => p.id === id);
  }

  emptyCart(): void {
    this.productsList = [];
  }
}
