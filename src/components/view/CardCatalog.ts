import { BaseCard, IBaseCardData } from './BaseCard';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export interface ICardCatalog extends IBaseCardData {
  image: string;
  category: keyof typeof categoryMap;
  price: number | null;
}

export class CardCatalog extends BaseCard<ICardCatalog> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;
  protected priceEl: HTMLElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    this.imageEl = this.container.querySelector('.card__image') as HTMLImageElement;
    this.categoryEl = this.container.querySelector('.card__category') as HTMLElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;

    this.container.addEventListener('click', () => {
      this.events.emit('product:select', { id: this.container.dataset.id as string });
    });
  }

  set data(p: ICardCatalog) {
    super.data = p;
    this.image = p.image;
    this.category = p.category;
    this.price = p.price;
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

  set price(value: number | null) {
    this.priceEl.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
  }
}
