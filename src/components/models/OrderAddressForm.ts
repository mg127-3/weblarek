import { OrderForm } from './OrderForm';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IOrderAddressForm {
  address: string;
  payment: 'card' | 'cash' | '';
  error: string;
  canSubmit: boolean;
}

export class OrderAddressForm extends OrderForm<IOrderAddressForm> {
  private addressInput: HTMLInputElement;
  private cardBtn: HTMLButtonElement;
  private cashBtn: HTMLButtonElement;
  private submitBtn: HTMLButtonElement;
  private errorEl: HTMLElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.cardBtn = ensureElement<HTMLButtonElement>('.button[name="card"]', this.container);
    this.cashBtn = ensureElement<HTMLButtonElement>('.button[name="cash"]', this.container);
    this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorEl = ensureElement<HTMLElement>('.form__errors', this.container);

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:address:change', { value: this.addressInput.value });
    });

    this.cardBtn.addEventListener('click', () => {
      this.events.emit('order:payment:change', { payment: 'card' as const });
    });
    this.cashBtn.addEventListener('click', () => {
      this.events.emit('order:payment:change', { payment: 'cash' as const });
    });
  }

  set address(value: string) {
    this.addressInput.value = value ?? '';
  }

  set payment(value: 'card' | 'cash' | '') {
    this.container.dataset.payment = value || '';
    this.cardBtn.classList.toggle('button_alt-active', value === 'card');
    this.cashBtn.classList.toggle('button_alt-active', value === 'cash');
  }

  set error(text: string) {
    this.errorEl.textContent = text ?? '';
    this.addressInput.classList.toggle('input_error', Boolean(text));
  }

  set canSubmit(v: boolean) {
    this.submitBtn.disabled = !v;
  }

  protected onSubmit(): void {
    this.events.emit('order:address:submit');
  }

}
