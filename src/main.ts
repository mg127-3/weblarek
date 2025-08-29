import './scss/styles.scss';
import { apiProducts } from "./utils/data";
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { ShopApi } from './components/models/ShopApi';
import { API_URL } from './utils/constants';


// Tests:
// Products 
const productsModel = new Products();
productsModel.setProductList(apiProducts.items);
console.log("Каталог — все товары:", productsModel.getProductList());
const firstId = apiProducts.items[0].id;
console.log("Каталог — товар по id:", productsModel.getItemById(firstId));
productsModel.setItem(apiProducts.items[1]);
console.log("Каталог — выбранный товар:", productsModel.getItem());

// Cart
const cart = new Cart();
cart.addProductToCart(apiProducts.items[0]);
cart.addProductToCart(apiProducts.items[1]);
console.log("Корзина — список:", cart.getCartProductsList());
console.log("Корзина — количество товаров:", cart.getCartProductQuantity());
console.log("Корзина — общая стоимость:", cart.getCartProductPrice());
const idToRemove = apiProducts.items[0].id;
cart.removeProductFromCart(idToRemove);
console.log("Корзина - После удаления товара:", cart.getCartProductsList());
cart.emptyCart();
console.log("Корзина — после очистки:", cart.getCartProductsList());

// Buyer
const buyer = new Buyer("card", "test@example.com", "+7000000000", "Test Address, 1");
console.log("Покупатель — данные:", buyer.getUserData());
console.log("Покупатель — валидация:", buyer.userDataValidation());
buyer.setUserData({ payment: "cash", email: "bad-email", phone: "12", address: "" });
console.log("Покупатель — новые данные (намеренно плохие):", buyer.getUserData());
console.log("Покупатель — валидация (ожидаем false):", buyer.userDataValidation());
buyer.resetUserData();
console.log("Покупатель — после сброса:", buyer.getUserData());

// ShopApi
const apiInstance = new Api(API_URL);
const shopApi = new ShopApi(apiInstance);
shopApi.getProducts()
  .then(products => {
    console.log("Товары с сервера:", products);
  })
  .catch(err => console.error("Ошибка при получении товаров:", err));