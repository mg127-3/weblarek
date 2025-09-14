import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IBaseCardData {
  id: string;
  title: string;
}

export abstract class BaseCard<T extends IBaseCardData = IBaseCardData> extends Component<T> {
  protected events: IEvents;
  protected titleEl: HTMLElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container);
    this.events = events;
    this.titleEl = this.container.querySelector('.card__title') as HTMLElement;
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set data(product: T) {
    this.id = product.id;
    this.title = product.title;
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }
}
