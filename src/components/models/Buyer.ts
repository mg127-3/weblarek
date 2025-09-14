import { IBuyer, IValidationResult } from "../../types";

export class Buyer implements IBuyer {
  payment: "card" | "cash" | "";
  email: string;
  phone: string;
  address: string;

  constructor(
    payment: "card" | "cash" | "",
    email: string,
    phone: string,
    address: string
  ) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  validateAddress(): IValidationResult {
    if (!this.address.trim()) {
      return {valid: false, message: "Укажите адрес доставки"};
    }
    return {valid: true}
  }

  validatePayment(): IValidationResult {
    if (this.payment !== "card" && this.payment !== "cash") {
      return {valid: false, message: "Выберите способ оплаты"};
    }
    return {valid: true};
  }

  validateContacts(): IValidationResult {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    const phoneOk = /^\+?\d{7,15}$/.test(this.phone.replace(/\s+/g, ""));
    if (!emailOk) return {valid: false, message: "Введите корректный email"};
    if (!phoneOk) return {valid: false, message: "Введите корректный номер телефона"};
    return {valid: true}
  }

  validateAll(): boolean {
    return (
      this.validateAddress().valid && this.validatePayment().valid && this.validateContacts().valid
    )
  }

  getUserData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  setUserData(data: IBuyer): void {
    this.payment = data.payment;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
  }

  resetUserData(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }
}
