import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IModalContainer {
  content: HTMLElement
}

export class ModalContainer extends Component<IModalContainer> {
  protected modalContent: HTMLElement;
  protected modalCloseButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);
    this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.modalCloseButton.addEventListener('click', () => {
      this.container.classList.remove('modal_active');
      this.events.emit('modal:close');
    });

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.container.classList.contains('modal_active')) {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
      }
    });
  }

  set content(data: HTMLElement) {
    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(data);
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

}