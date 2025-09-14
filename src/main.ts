import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import type { IEvents } from "./components/base/Events";

import { API_URL, CDN_URL, categoryMap } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";
import type { IProduct } from "./types";

import { ShopApi } from "./components/models/ShopApi";
import { Products } from "./components/models/Products";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";

import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { ModalContainer } from "./components/view/ModalContainer";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CartItem } from "./components/view/CartItem";
import { CartView } from "./components/view/CartView";
import { OrderSuccess } from "./components/view/OrderSuccess";
import { OrderAddressForm } from "./components/view/OrderAddressForm";
import { OrderContactsForm } from "./components/view/OrderContactsForm";
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

let addressForm: OrderAddressForm | null = null;
let contactsForm: OrderContactsForm | null = null;
let isCartOpen = false;


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

  const row = new CartItem(events, li);
  return row.render({
    id: p.id,
    title: p.title,
    price: p.price as number,
    index: index + 1,
  });
}

function openPreview(product: IProduct) {
  const tplEl = ensureElement<HTMLTemplateElement>('#card-preview');
  const node = (tplEl.content.querySelector('.card')! as HTMLElement)
    .cloneNode(true) as HTMLElement;

  const view = new CardPreview(events, node);

  view.data = {
    id: product.id,
    title: product.title,
    price: product.price,
    image: `${CDN_URL}${product.image}`,
    category: product.category as keyof typeof categoryMap,
    description: product.description,
  };

  view.updateCartState(cartModel.getProductAvailability(product.id));

  modal.content = node;
}



function openCart() {
  const tplEl = ensureElement<HTMLTemplateElement>('#basket');
  const node = (tplEl.content.querySelector('.basket')! as HTMLElement).cloneNode(true) as HTMLElement;

  const cartView = new CartView(events, node);
  const rows = cartModel.getCartProductsList().map(buildCartRow);

  cartView.items = rows;
  cartView.total = cartModel.getCartProductPrice();
  cartView.canSubmit = rows.length > 0;

  isCartOpen = true;
  modal.content = node;
}


function openOrderAddress() {
  const node = cloneTemplate<HTMLElement>('#order');
  addressForm = new OrderAddressForm(events, node);
  modal.content = addressForm.render({
    address: buyer.address,
    payment: buyer.payment,
    error: '',
    canSubmit: buyer.validateAddress().valid && buyer.validatePayment().valid,
  });
}


function openOrderContacts() {
  const node = cloneTemplate<HTMLElement>('#contacts');
  contactsForm = new OrderContactsForm(events, node);
  modal.content = contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    error: '',
    canSubmit: buyer.validateContacts().valid,
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

events.on('modal:close', () => {
  addressForm = null;
  contactsForm = null;
  isCartOpen = false;
});

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
  if (isCartOpen) {
    openCart();
  }
});

events.on("order:open", openOrderAddress);

events.on('order:address:change', (payload: { value: string }) => {
  const { value } = payload;
  buyer.address = value;
  const a = buyer.validateAddress();
  const p = buyer.validatePayment();

  if (!addressForm) return;
  addressForm.error = a.message || p.message || '';
  addressForm.canSubmit = a.valid && p.valid;
});


events.on('order:payment:change', (payload: { payment: 'card' | 'cash' }) => {
  const { payment } = payload;
  buyer.payment = payment;
  const a = buyer.validateAddress();
  const p = buyer.validatePayment();

  if (!addressForm) return;
  addressForm.error = a.message || p.message || '';
  addressForm.canSubmit = a.valid && p.valid;
  addressForm.payment = buyer.payment;
});

events.on('order:address:submit', () => {
  const a = buyer.validateAddress();
  const p = buyer.validatePayment();

  if (!addressForm) return;
  if (!a.valid || !p.valid) {
    addressForm.error = a.message || p.message || '';
    addressForm.canSubmit = false;
    return;
  }
  openOrderContacts();
});

events.on('order:email:change', (payload: { value: string }) => {
  const { value } = payload;
  buyer.email = value;
  const c = buyer.validateContacts();

  if (!contactsForm) return;
  contactsForm.error = c.message || '';
  contactsForm.canSubmit = c.valid;
});

events.on('order:phone:change', (payload: { value: string }) => {
  const { value } = payload;
  buyer.phone = value;
  const c = buyer.validateContacts();

  if (!contactsForm) return;
  contactsForm.error = c.message || '';
  contactsForm.canSubmit = c.valid;
});

events.on('order:contacts:submit', async () => {
  if (!buyer.validateAll()) {
    return;
  }

  const items = cartModel.getCartProductsList().map(p => p.id);
  const total = cartModel.getCartProductPrice();
  const { email, phone, address } = buyer.getUserData();
  const payment: 'card' | 'cash' = buyer.payment === 'card' ? 'card' : 'cash';

  const payload: IOrderRequest = { items, payment, address, email, phone, total };

  try {
    await shopApi.postOrder(payload);
    openOrderSuccess(total);
    cartModel.emptyCart();
    header.counter = 0;
    buyer.resetUserData();
  } catch (e) {
    console.error('Order request failed:', e);
  }
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
