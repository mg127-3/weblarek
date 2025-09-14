import { BaseCard, IBaseCardData } from './BaseCard';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export interface ICardPreview extends IBaseCardData {
  image: string;
  category: keyof typeof categoryMap;
  description: string;
  price: number | null;
}

export class CardPreview extends BaseCard<ICardPreview> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;
  protected priceEl: HTMLElement;
  protected descEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;

  private inCart = false;
  private productId = '';

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    this.imageEl = this.container.querySelector('.card__image') as HTMLImageElement;
    this.categoryEl = this.container.querySelector('.card__category') as HTMLElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;
    this.descEl = this.container.querySelector('.card__text') as HTMLElement;
    this.buttonEl = this.container.querySelector('.card__button') as HTMLButtonElement;

    this.buttonEl.addEventListener('click', () => {
      if (this.buttonEl.disabled || !this.productId) return;
      this.events.emit(this.inCart ? 'basket:remove' : 'basket:add', { id: this.productId });
      this.inCart = !this.inCart;
      this.updateButtonView();
    });

  }

  public updateCartState(inCart: boolean) {
    this.inCart = inCart;
    this.updateButtonView();
  }

  private updateButtonView() {
    if (this.buttonEl.disabled) {
      this.buttonEl.textContent = 'Недоступно';
    }
    else {
      this.buttonEl.textContent = this.inCart ? 'Удалить из корзины' : 'Купить';
    }
  }

  set data(p: ICardPreview) {
    super.data = p;
    this.productId = String(p.id);
    this.image = p.image;
    this.category = p.category;
    this.description = p.description;
    this.price = p.price;
    this.updateButtonView();
  }

  set image(src: string) {
    const alt = this.titleEl?.textContent || '';
    this.setImage(this.imageEl, src, alt);
  }

  set category(value: keyof typeof categoryMap) {
    this.categoryEl.className = 'card__category';
    this.categoryEl.classList.add(categoryMap[value]);
    this.categoryEl.textContent = value;
  }

  set description(text: string) {
    this.descEl.textContent = text;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceEl.textContent = 'Бесценно';
      this.buttonEl.disabled = true;
    } else {
      this.priceEl.textContent = `${value} синапсов`;
      this.buttonEl.disabled = false;
    }
    this.updateButtonView();
  }
}
