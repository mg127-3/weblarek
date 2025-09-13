// src/components/models/Basket.ts
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ICartView {
  items: HTMLElement[];
  total: number;
  canSubmit: boolean;
}

export class CartView extends Component<ICartView> {
  protected listEl: HTMLElement;
  protected totalEl: HTMLElement;
  protected submitBtn: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.listEl = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalEl = ensureElement<HTMLElement>('.basket__price', this.container);
    this.submitBtn = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.submitBtn.addEventListener('click', () => {
      if (!this.submitBtn.disabled) {
        this.events.emit('order:open');
      }
    });
  }

  set items(nodes: HTMLElement[]) {
    this.listEl.replaceChildren(...nodes);
  }

  set total(value: number) {
    this.totalEl.textContent = `${value} синапсов`;
  }

  set canSubmit(value: boolean) {
    this.submitBtn.disabled = !value;
  }
}