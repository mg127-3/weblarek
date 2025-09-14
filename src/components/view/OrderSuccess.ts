import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export interface IOrderSuccess {
  total: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected titleEl: HTMLElement;
  protected descriptionEl: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, onClose?: () => void) {
    const node = cloneTemplate<HTMLElement>(template);
    super(node);

    this.titleEl = ensureElement<HTMLElement>('.order-success__title', node);
    this.descriptionEl = ensureElement<HTMLElement>(
      '.order-success__description',
      node
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      node
    );

    if (onClose) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        onClose();
      });
    }
  }

  set total(value: number) {
    this.descriptionEl.textContent = `Списано ${value} синапсов`;
  }

  set title(text: string) {
    this.titleEl.textContent = text ?? '';
  }
}
