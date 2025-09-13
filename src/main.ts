import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import type { IEvents } from "./components/base/Events";

import { API_URL, CDN_URL, categoryMap } from "./utils/constants";
import { ensureElement } from "./utils/utils";
import type { IProduct } from "./types";

import { ShopApi } from "./components/models/ShopApi";
import { Products } from "./components/models/Products";
import { Cart } from "./components/models/Cart";

import { Header } from "./components/models/Header";
import { Gallery } from "./components/models/Gallery";
import { ModalContainer } from "./components/models/ModalContainer";

import { CardCatalog } from "./components/models/CardCatalog";
import { CardPreview } from "./components/models/CardPreview";
import { CartItems } from "./components/models/CartItems";
import { CartView } from "./components/models/CartView";
import { Buyer } from "./components/models/Buyer";
import { OrderSuccess } from "./components/models/OrderSuccess";
import { OrderAddressForm } from "./components/models/OrderAddressForm";
import { OrderContactsForm } from "./components/models/OrderContactsForm";
import { IOrderRequest } from "./types";

const events: IEvents = new EventEmitter();
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

const productsModel = new Products();
const cartModel = new Cart();
const buyer = new Buyer("", "", "", "");

const page = ensureElement<HTMLElement>(".page");
const header = new Header(events, ensureElement<HTMLElement>(".header", page));
const gallery = new Gallery(events, page);
const modal = new ModalContainer(
  events,
  ensureElement<HTMLElement>(".modal", page)
);


function buildCatalogCard(p: IProduct): HTMLElement {
  const tplEl = ensureElement<HTMLTemplateElement>('#card-catalog');
  const root = (tplEl.content.querySelector('.card')! as HTMLElement).cloneNode(true) as HTMLElement;

  const card = new CardCatalog(events, root);
  return card.render({
    id: p.id,
    title: p.title,
    price: p.price,
    image: `${CDN_URL}${p.image}`,
    category: p.category as keyof typeof categoryMap,
  });
}

function buildCartRow(p: IProduct, index: number): HTMLElement {
  const tplEl = ensureElement<HTMLTemplateElement>('#card-basket');
  const li = (tplEl.content.querySelector('.basket__item')! as HTMLElement).cloneNode(true) as HTMLElement;

  const row = new CartItems(events, li);
  return row.render({
    id: p.id,
    title: p.title,
    price: p.price as number,
    index: index + 1,
  });
}


function openPreview(product: IProduct) {
  const tplEl = ensureElement<HTMLTemplateElement>('#card-preview');
  const node = (tplEl.content.querySelector('.card')! as HTMLElement).cloneNode(true) as HTMLElement;

  const view = new CardPreview(events, node);
  const rendered = view.render({
    id: product.id,
    title: product.title,
    price: product.price,
    image: `${CDN_URL}${product.image}`,
    category: product.category as keyof typeof categoryMap,
    description: product.description,
  });

  const btn = ensureElement<HTMLButtonElement>('.card__button', rendered);
  const inCart = cartModel.getProductAvailability(product.id);

  if (product.price !== null) {
    btn.textContent = inCart ? 'Удалить из корзины' : 'Купить';
    btn.onclick = () => {
      events.emit(inCart ? 'basket:remove' : 'basket:add', { id: product.id });
      modal.close();
    };
  }
  modal.content = rendered;
}


function openCart() {
  const tplEl = ensureElement<HTMLTemplateElement>('#basket');
  const node = (tplEl.content.querySelector('.basket')! as HTMLElement).cloneNode(true) as HTMLElement;

  const cartView = new CartView(events, node);
  const rows = cartModel.getCartProductsList().map(buildCartRow);

  cartView.items = rows;
  cartView.total = cartModel.getCartProductPrice();
  cartView.canSubmit = rows.length > 0;

  modal.content = node;
}


function openOrderAddress() {
  const tplEl = ensureElement<HTMLTemplateElement>('#order');
  const node = (tplEl.content.querySelector('form')! as HTMLFormElement).cloneNode(true) as HTMLFormElement;

  const form = new OrderAddressForm(events, node);
  modal.content = form.render({
    address: buyer.address || '',
    payment: buyer.payment || '',
    error: '',
    canSubmit: buyer.validateAddress() && buyer.validatePayment(),
  });
}

function openOrderContacts() {
  const tplEl = ensureElement<HTMLTemplateElement>('#contacts');
  const node = (tplEl.content.querySelector('form')! as HTMLFormElement).cloneNode(true) as HTMLFormElement;

  const form = new OrderContactsForm(events, node);
  modal.content = form.render({
    email: buyer.email || '',
    phone: buyer.phone || '',
    error: '',
    canSubmit: buyer.validateContacts(),
  });

  const syncAutofill = () => {
    const formEl = modal.content as HTMLFormElement;
    const emailEl = formEl.querySelector<HTMLInputElement>('input[name="email"]');
    const phoneEl = formEl.querySelector<HTMLInputElement>('input[name="phone"]');

    const emailVal = emailEl?.value?.trim() || '';
    const phoneVal = phoneEl?.value?.trim() || '';

    if (emailVal) events.emit('order:email:change', { value: emailVal });
    if (phoneVal) events.emit('order:phone:change', { value: phoneVal });
  };

  requestAnimationFrame(syncAutofill);
  setTimeout(syncAutofill, 50);
}

function openOrderSuccess(total: number) {
  const tplEl = ensureElement<HTMLTemplateElement>("#success");
  const view = new OrderSuccess(tplEl, () => {
    modal.close();
  });

  view.title = "Заказ оформлен";
  view.total = total;

  modal.content = view.render({ total });
}


events.on("basket:open", openCart);

events.on<{ id: string }>("product:select", ({ id }) => {
  const product = productsModel.getItemById(id);
  if (product) openPreview(product);
});

events.on<{ id: string }>("basket:add", ({ id }) => {
  const product = productsModel.getItemById(id);
  if (!product) return;
  if (product.price === null) return;
  if (cartModel.getProductAvailability(id)) return;

  cartModel.addProductToCart(product);
  header.counter = cartModel.getCartProductsList().length;
});

events.on<{ id: string }>("basket:remove", ({ id }) => {
  cartModel.removeProductFromCart(id);
  header.counter = cartModel.getCartProductsList().length;

  const modalEl = ensureElement<HTMLElement>(".modal", page);
  const isCartOpen =
    modalEl.classList.contains("modal_active") &&
    !!modalEl.querySelector(".basket");
  if (isCartOpen) {
    openCart();
  }
});

events.on("order:open", openOrderAddress);

events.on<{ value: string }>("order:address:change", ({ value }) => {
  buyer.address = value;
  const ok = buyer.validateAddress() && buyer.validatePayment();

  const form = modal.content as HTMLFormElement;
  ensureElement<HTMLInputElement>('input[name="address"]', form).value = value;
  ensureElement<HTMLElement>(".form__errors", form).textContent =
    buyer.validateAddress() ? "" : "Укажите адрес";
  ensureElement<HTMLButtonElement>('button[type="submit"]', form).disabled =
    !ok;
});

events.on<{ payment: "card" | "cash" }>(
  "order:payment:change",
  ({ payment }) => {
    buyer.payment = payment;
    const ok = buyer.validateAddress() && buyer.validatePayment();

    const form = modal.content as HTMLFormElement;
    const cardBtn = ensureElement<HTMLButtonElement>(
      '.button[name="card"]',
      form
    );
    const cashBtn = ensureElement<HTMLButtonElement>(
      '.button[name="cash"]',
      form
    );
    cardBtn.classList.toggle("button_alt-active", payment === "card");
    cashBtn.classList.toggle("button_alt-active", payment === "cash");

    ensureElement<HTMLElement>(".form__errors", form).textContent =
      buyer.validatePayment() ? "" : "Выберите способ оплаты";
    ensureElement<HTMLButtonElement>('button[type="submit"]', form).disabled =
      !ok;
  }
);

events.on("order:address:submit", () => {
  if (!(buyer.validateAddress() && buyer.validatePayment())) {
    const form = modal.content as HTMLFormElement;
    ensureElement<HTMLElement>(".form__errors", form).textContent =
      "Заполните адрес и выберите способ оплаты";
    ensureElement<HTMLButtonElement>('button[type="submit"]', form).disabled =
      true;
    return;
  }
  openOrderContacts();
});

events.on<{ value: string }>("order:email:change", ({ value }) => {
  buyer.email = value;
  const ok = buyer.validateContacts();

  const form = modal.content as HTMLFormElement;
  ensureElement<HTMLElement>(".form__errors", form).textContent = ok
    ? ""
    : "Проверьте email и телефон";
  ensureElement<HTMLButtonElement>('button[type="submit"]', form).disabled =
    !ok;
});

events.on<{ value: string }>("order:phone:change", ({ value }) => {
  buyer.phone = value.replace(/\s+/g, "");
  const ok = buyer.validateContacts();

  const form = modal.content as HTMLFormElement;
  ensureElement<HTMLElement>(".form__errors", form).textContent = ok
    ? ""
    : "Проверьте email и телефон";
  ensureElement<HTMLButtonElement>('button[type="submit"]', form).disabled =
    !ok;
});

events.on('order:contacts:submit', async () => {
  if (!buyer.validateContacts()) {
    const form = modal.content as HTMLFormElement;
    ensureElement<HTMLElement>('.form__errors', form).textContent = 'Проверьте email и телефон';
    ensureElement<HTMLButtonElement>('button[type="submit"]', form).disabled = true;
    return;
  }

  if (!buyer.validatePayment() || !buyer.validateAddress()) {
    const form = modal.content as HTMLFormElement;
    ensureElement<HTMLElement>('.form__errors', form).textContent = 'Заполните адрес и выберите способ оплаты';
    ensureElement<HTMLButtonElement>('button[type="submit"]', form).disabled = true;
    return;
  }

  const items = cartModel.getCartProductsList().map((p) => p.id);
  const total = cartModel.getCartProductPrice();

  const payment: 'card' | 'cash' = buyer.payment === 'card' ? 'card' : 'cash';
  const { email, phone, address } = buyer.getUserData();

  const payload: IOrderRequest = {
    items,
    payment,
    address,
    email,
    phone,
    total,
  };

  await shopApi.postOrder(payload);

  openOrderSuccess(total);

  cartModel.emptyCart();
  header.counter = 0;
  buyer.resetUserData();
});

shopApi
  .getProducts()
  .then((items) => {
    productsModel.setProductList(items);
    const cards = items.map(buildCatalogCard);
    (gallery as any).catalog = cards;
    header.counter = cartModel.getCartProductsList().length;
  })
  .catch((err) => {
    console.error("Ошибка при получении товаров:", err);
  });
