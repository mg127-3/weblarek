# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

### Интерфейс IProduct

Интерфейс карточки товара, который содержит всю необходимую информацию о товаре:  

`interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}`

### Интерфейс IBuyer
Интерфейс данных о пользователе, который содержит всю необходимую информацию о пользователе: 

`interface IBuyer {
     payment: 'card' | 'cash' | '';
     email: string;
     phone: string;
     address: string;
}`

### Класс Buyer

Класс Buyer имплементирует интерфейс IBuyer. Хранит данные о пользователе и позволяет получать, изменять, валидировать и сбрасывать эти данные.

 Содержит следующие поля:
- payment: информация о методе оплаты;
- email: информация о email адресе покупателя;
- phone: информация о номере телефона покупателя;
- address: информация об адресе покупателя

Класс содержит следующие методы: 
- validateAddress: валидация адреса;
- validatePayment: валидация способа оплаты;
- validateContacts: валидация контактных данных;
- validateAll: общая валидация данных об адреса и способе оплаты;
- getUserData: получение введенных данных;
- setUserData: сохранение введенных данных;
- resetUserData: очистка данных покупателя.

### Класс Cart

Класс Cart представляет корзину покупателя. С его помощью можно добавлять и удалять товары, получать количество и стоимость товаров, проверять наличие товара и очищать корзину. 

Содержит следующие поля:
- productsList: приватное поле; массив объекта, соответствующий интерфейсу IProduct. 

Класс также содержит следующие методы:
- setProductList: сохранение массив товатов в корзине;
- addProductToCart: добавление товара в корзину;
- removeProductFromCart: удаление товара из корзины;
- getCartProductQuantity: возвращение количества товаров в корзине;
- getCartProductsList: получение массива товаров в корзине;
- getCartProductPrice: получение общей стоимости товаров в корзине;
- getProductAvailability: получение информации о наличии товара;
- emptyCart: очистка корзины.

### Класс Products
Класс Products представляет каталог товаров. 
Содержит следующие поля:
- productList: приватное поле; массив объекта, соответствующий интерфейсу IProduct;
- item: приватное поле; объект типа IProduct либо null, представляет выбранный товар;

Класс так же содержит следующие методы: 
- setProductList: сохранение массива товаров;
- getProductList: получение массива товаров;
- getItemById: получение отдельного товара по его id;
- setItem: сохранение отдельного товара;
- getItem: получение отдельного товара;

## Слой коммуникации 

### Интерфейс IOrderRequest
Интерфейс IOrderRequest описывает данные для отправки на сервер:

`export interface IOrderRequest {
  items: string[];
  payment: 'card' | 'cash';
  address: string;
  email: string;
  phone: string;
  total: number;
}`

### Интерфейс IOrderResponse

Интерфейс IOrderResponse описывает ответ, получаемый от сервера после отправки данных:

`interface IOrderResponse {
  success: boolean;
  total: number;
}`

### Класс ShopApi

Класс ShopApi отвечает за получение товаров с сервера и отправку заказов на сервер. Принимает в конструкторе объект класса Api. 

Содержит поле api, экземпляр класса Api, через который будут выполняться запросы. 

Так же содержит следующие методы: 
- getProducts: получает с сервера массив всех товаров;
- postOrder: отправляет на сервер заказ пользователя.


## Слой представления

### Интерфейс IBaseCard
Интерфейс для базовых данных карточки:

`interface IBaseCardData {
  id: string;
  title: string;
}`


### Класс BaseCard
Класс описывает общий функционал карточек товаров (в каталоге, корзине и модальном окне детального отображения)

Содержит поля: 
- protected events: IEvents - брокер событий;
- protected titleEl - DOM-узел заголовка

Содержит сеттеры/методы:
- set id (value: string) - устанавливает id 
- set title (value: string) - устанавливает текст заголовка
- set data(product: T) - устанавливает id и title

### Интерфейс ICardCatalog
Интерфейс для каталога:

`interface ICardCatalog extends IBaseCardData {
  image: string;
  category: keyof typeof categoryMap;
  price: number | null;
}`

### Класс CardCatalog
Класс отвечает за отображение карточки товара в каталоге.

Содержит поля:
- protected imageEl: HTMLImageElement- элемент изображения
- protected categoryEl: HTMLElement - элемент категории
- protected priceEl: HTMLElement - элемент цены

Содержит сеттеры/методы:
- set image(src: string) - ставит изображение
- set category(value: keyof typeof categoryMap) - устанавливает текст категории и модификатор фона 
- set price(value: number | null) - устанавливает цену товара или, при ее отсутствии, "Бесценно"

### Интерфейс IModalContainer
Интерфейс для базового модального окна:

`interface IModalContainer {
  content: HTMLElement
}`

### Класс ModalContainer
Класс отвечает за оболочку модального окна, вставку контента в него и открытие и закрытие окна.

Содержит поля:
- protected modalContent: HTMLElement - вставляемый контент;
- protected modalCloseButton: HTMLButtonElement - закрытие модального окна.

Содержит сеттеры/методы:
- set content(node: HTMLElement) — вставка контент и открытие модального окна;
- обработчик клика по значку крестика - закрывает модальное окно;
- обработчик клика по оверлею или клавише Esc - закрывает модальное окно.

### Интерфейс ICardPreview
Интерфейс для детального превью карточки:

`interface ICardPreview extends IBaseCardData {
  image: string;
  category: keyof typeof categoryMap;
  description: string;
  price: number | null;
}`

### Класс CardPreview
Класс отвечает за отображение модального окна с детальным отображением товара.

Содержит поля: 
- protected imageEl: HTMLImageElement - элемент изображения
- protected categoryEl: HTMLElement - элемент категории
- protected priceEl: HTMLElement - элемент цены
- protected descEl: HTMLElement - элемент описания товара
- protected buttonEl: HTMLButtonElement — кнопка «Купить/Удалить из корзины».

Содержит сеттеры/методы: 
- set image(src: string) — ставит изображение + alt;
- set category(value) — ставит категорию товара;
- set description(text: string) — описание товара;
- set price(value: number | null) — управляет текстом цены и состоянием кнопки: 
    -- null = «Бесценно», кнопка disabled, «Недоступно»;
    -- число = <value> синапсов, кнопка активна, «Купить».
- Обработчик события клика на кнопку: добавление/удаление товара из корзины и закрытие модального окна.

### Интерфейс ICartItems
Интерфейс для строки корзины:

`interface ICartItems extends IBaseCardData {
  price: number;
  index: number;
}`

### Класс CartItems
Класс отвечает за отображение отдельной позиции товара в модальном окне корзины.

Содержит поля:
- protected indexEl: HTMLElement - элемент индекса товара (нумерация в корзине)
- protected priceEl: HTMLElement - элемент цены товара
- protected deleteBtn: HTMLButtonElement - элемент кнопки удаления товара из корзины

Содержит сеттеры/методы:

- set data(p: ICartItems) — применение id/title/index/price.
- set index(value: number) — присвоение порядковый номер.
- set price(value: number) — отображение цены товара.
- обработчик события клика по кнопке удаления, которое удаляет товар из корзины

### Интерфейс ICartView
Интерфейс для модального окна корзины:

`interface ICartView {
  items: HTMLElement[];
  total: number;
  canSubmit: boolean;
}`

### Класс CartView

Класс отвечает за модальное окно с корзиной товаров, содержит список товаров, итоговую цену и кнопку для перехода к оформлению заказа.

Содержит поля:
- protected listEl: HTMLElement — контейнер списка;
- protected totalEl: HTMLElement — итоговая сумма;
- protected submitBtn: HTMLButtonElement — «Оформить».

Содержит сеттеры/методы:
- set items(nodes: HTMLElement[]) — заменить список строк;
- set total(value: number) — обновить сумму;
- set canSubmit(value: boolean) — включить/выключить кнопку;
- обработчик события клика на кнопку для оформления заказа.

### Интерфейс IGallery
Интерфейс для галереи карточек: 

`interface IGallery {
    catalog: HTMLElement[];
}`

### Класс Gallery
Класс отвечает за отображение галереи карточек товаров. 

Содержит поля:
- catalogElement: HTMLElement — элемент галереи.

Содержит сеттеры/методы:
- set catalog(items: HTMLElement[]) - отображение галереи карточек.

### Интерфейс IHeader
Интерфейс для отображения шапки приложения со значком корзины и счетчиком товаров в ней: 

`interface IHeader {
    counter: number
}`

### Класс Header
Класс отвечает за отображение счетчика товаров в корзине и содержит кнопку для открытия корзины товаров.

Содержит поля:
- protected cartButton: HTMLButtonElement - кнопка открытия корзины;
- protected cartCounter: HTMLElement - счетчик товаров в корзине.

Содержит сеттеры/методы:
- set counter(value: number) — счетчик товаров в корзине;
- обработчик клика на значок корзины. 

### Класс OrderForm

Абстрактный класс, содержащие единое поведение форм заказа.

Содержит поля:
- protected form: HTMLFormElement - элемент формы.

Содержит сеттеры: 
- protected abstract onSubmit(): void — абстрактная функция, вызывается при submit. 

### Интерфейс IOrderAddressForm
Интерфейс для модального окна информации о покупателе (адрес + способ оплаты):

`interface IOrderAddressForm {
  address: string;
  payment: 'card' | 'cash' | '';
  error: string;
  canSubmit: boolean;
}`

### Класс OrderAddressForm
Класс отвечает за содержимое модального окна с данными покупателя (адрес и способ оплаты). 

Содержит поля:
- private addressInput: HTMLInputElement - инпут адреса;
- private cardBtn: HTMLButtonElement - кнопка для оплаты картой;
- private cashBtn: HTMLButtonElement- кнопка для оплаты наличиными при получении;
- private submitBtn: HTMLButtonElement - кнопка перехода к следующему шагу заказа;
- private errorEl: HTMLElement - элемент ошибки при неправильном заполнении полей.

Содержит сеттеры/методы:
- set address(value: string) — ввод адреса;
- set payment(value: 'card'|'cash'|'') — визуальный выбор способа оплаты;
- set error(text: string) — показать сообщение об ошибке;
- set canSubmit(v: boolean) — доступность «Далее»;
- обработчик submit;
- обработчик события изменения адреса при вводе;
- обработчик события изменения способа оплаты.

### Интерфейс IOrderContactsForm
Интерфейс для модального окна информации о покупателе (email + номер телефона):

`interface IOrderContactsForm {
  email: string;
  phone: string;
  error: string;
  canSubmit: boolean;
}`

### Класс OrderContactsForm
Класс отвечает за содержимое модального окна с данными покупателя (email адрес и номер телефона). 

Содержит поля:
- private emailInput: HTMLInputElement - инпут для email адреса;
- private phoneInput: HTMLInputElement - инпут для номера телефона;
- private submitBtn: HTMLButtonElement - кнопка продолжения покупки;
- private errorEl: HTMLElement - элемент ошибки при неправильном заполнении полей.

Содержит сеттеры/методы:
- set email(value: string) - ввод email адреса;
- set phone(value: string) - ввод номера телефона;
- set error(text: string) — отображение ошибки;
- set canSubmit(v: boolean) - доступность продолжения покупки;
- обработчик перехода к следующему этапу покупки.
- обработчик события изменения номера телефона.

### Интерфейс IOrderSuccess
Интерфейс для модального окна успешной покупки:

`interface IOrderSuccess {
  total: number;
}`

### Класс OrderSuccess
Класс отвечает за отображение модального окна с подтверждением успешной покупки.

Содержит поля:
- protected titleEl: HTMLElement;
- protected descriptionEl: HTMLElement;
- protected closeButton: HTMLButtonElement.

Содержит сеттеры/методы:
- обработчик закрытия модального окна;
- set total(value: number) — отображение финальной суммы покупки;
- set title(text: string) — отображение заголовка. 

## Presenter - main.ts

Назначение: связывает модели данных со слоем представления.

Ключевой функционал:

- buildCatalogCard(p: IProduct): HTMLElement — создаёт CardCatalog из шаблона #card-catalog, заполняет через render({ id, title, price, image: CDN_URL + image, category }).

- buildCartRow(p: IProduct, index: number): HTMLElement — создаёт строку корзины CartItems из #card-basket.

- openPreview(product: IProduct): void — рендерит CardPreview (#card-preview), создает обработчик на кнопке, который вызывает basket:add или basket:remove и закрывает модальное окно.

- openCart(): void — отрисовывает CartView (#basket): список позиций, итог, доступность «Оформить», вставляет в ModalContainer.

- openOrderAddress(): void — отрисовывает OrderAddressForm (#order) с текущим состоянием Buyer; управляет отображением ошибок.

- openOrderContacts(): void — рендерит OrderContactsForm (#contacts), синхронизирует возможное авто-заполнение браузера (что позволяет избежать проблемы с отключенной кнопкой при автозаполненных полях), управляет ошибками/отключением кнопки.

- openOrderSuccess(total: number): void — отрисовывает OrderSuccess (#success) и закрывает модальное окно при клике на кнопку.

Инициализация/загрузка:

Создаются: 
- events, api (API_URL), shopApi, productsModel, cartModel, buyer.
- View: Header, Gallery, ModalContainer.
- shopApi.getProducts() -> productsModel.setProductList(items) -> в Gallery попадают карточки из buildCatalogCard, в Header счётчик корзины.