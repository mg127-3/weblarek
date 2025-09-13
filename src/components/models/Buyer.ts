import { IBuyer } from "../../types";

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

  validateAddress(): boolean {
    return this.address.trim().length > 0;
  }

  validatePayment(): boolean {
    return this.payment === "card" || this.payment === "cash";
  }

  validateContacts(): boolean {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    const phoneOk = /^\+?\d{7,15}$/.test(this.phone.replace(/\s+/g, ""));
    return emailOk && phoneOk;
  }

  validateAll(): boolean {
    return this.validateAddress() && this.validatePayment() && this.validateContacts();
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
