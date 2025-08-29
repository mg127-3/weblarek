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

  // temporary validation
  userDataValidation(): boolean {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    const phoneOk = this.phone.replace(/\D/g, "").length >= 7;
    const addressOk = this.address.trim().length > 0;
    const paymentOk =
      this.payment === "card" || this.payment === "cash" || this.payment === "";
    return emailOk && phoneOk && addressOk && paymentOk;
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
