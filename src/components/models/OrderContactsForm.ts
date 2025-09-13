import { OrderForm } from './OrderForm';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IOrderContactsForm {
  email: string;
  phone: string;
  error: string;
  canSubmit: boolean;
}

export class OrderContactsForm extends OrderForm<IOrderContactsForm> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private errorEl: HTMLElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorEl = ensureElement<HTMLElement>('.form__errors', this.container);

    this.emailInput.addEventListener('input', () => {
      this.events.emit('order:email:change', { value: this.emailInput.value });
    });
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('order:phone:change', { value: this.phoneInput.value });
    });
  }

  set email(v: string) {
    this.emailInput.value = v ?? '';
  }
  set phone(v: string) {
    this.phoneInput.value = v ?? '';
  }
  set error(text: string) {
    this.errorEl.textContent = text ?? '';
    const show = Boolean(text);
    this.emailInput.classList.toggle('input_error', show);
    this.phoneInput.classList.toggle('input_error', show);
  }
  set canSubmit(v: boolean) {
    this.submitBtn.disabled = !v;
  }

  protected onSubmit(): void {
    this.events.emit('order:contacts:submit');
  }

}
