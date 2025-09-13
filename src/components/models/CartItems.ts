
import { BaseCard, IBaseCardData } from './BaseCard';
import { IEvents } from '../base/Events';

export interface ICartItems extends IBaseCardData {
  price: number;
  index: number;
}

export class CartItems extends BaseCard<ICartItems> {
  protected indexEl: HTMLElement;
  protected priceEl: HTMLElement;
  protected deleteBtn: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.indexEl = this.container.querySelector('.basket__item-index') as HTMLElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;
    this.deleteBtn = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;

    if (this.deleteBtn) this.deleteBtn.type = 'button';

    this.deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = this.container.dataset.id;
      if (id) this.events.emit('basket:remove', { id });
    });
  }

  set data(p: ICartItems) {
    super.data = p;
    this.index = p.index;
    this.price = p.price;
  }

  set index(value: number) {
    this.indexEl.textContent = String(value);
  }

  set price(value: number) {
    this.priceEl.textContent = `${value} синапсов`;
  }
}