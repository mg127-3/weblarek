import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class OrderForm<T> extends Component<T> {
  protected form: HTMLFormElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.form = container as HTMLFormElement;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  protected abstract onSubmit(): void;
}
