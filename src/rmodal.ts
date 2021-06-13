const splitClasses = (classes?: string) => (
  `${classes || ''}`
    .split(' ')
    .filter(cls => !!cls)
);

const addClass = (el: HTMLElement, classes?: string) => {
  splitClasses(classes).forEach((cls) => {
    el.classList.add(cls)
  });
};

const removeClass = (el: HTMLElement, classes?: string) => {
  splitClasses(classes).forEach((cls) => {
    el.classList.remove(cls)
  });
};

export interface RModalOptions {
  afterClose?(): void;
  afterOpen?(): void;
  beforeClose?(callback: () => any): void;
  beforeOpen?(callback: () => any): void;
  bodyClass?: string;
  closeTimeout?: number;
  content?: string;
  dialogClass?: string;
  dialogOpenClass?: string;
  dialogCloseClass?: string;
  escapeClose?: boolean;
  focus?: boolean;
  focusElements?: string[];
}

type OptionsKey = keyof RModalOptions;

class RModal {
  static version = '@@VERSION@@';
  version = '@@VERSION@@';

  overlay: HTMLElement;
  dialog: HTMLElement;
  focusOutElement: HTMLElement | null = null;
  opened = false;

  opts: RModalOptions = {
    bodyClass: 'modal-open',
    dialogClass: 'modal-dialog',
    dialogOpenClass: 'bounceInDown',
    dialogCloseClass: 'bounceOutUp',
    focus: true,
    focusElements: [
      'a[href]', 'area[href]', 'input:not([disabled]):not([type=hidden])',
      'button:not([disabled])', 'select:not([disabled])',
      'textarea:not([disabled])', 'iframe', 'object', 'embed',
      '*[tabindex]', '*[contenteditable]'
    ],
    escapeClose: true,
    content: undefined,
    closeTimeout: 500
  };

  constructor(el: HTMLElement, opts: RModalOptions = {}) {
    Object.keys(opts).forEach((key) => {
      const optionsKey = key as OptionsKey;

      /* istanbul ignore else */
      if (opts[optionsKey] !== undefined) {
        this.opts[optionsKey] = opts[optionsKey] as any;
      }
    });

    this.overlay = el;
    this.dialog = el.querySelector(`.${this.opts.dialogClass}`) as HTMLElement;

    if (this.opts.content) {
      this.content(this.opts.content);
    }
  }

  open(content: string): void {
    this.content(content);

    if (typeof this.opts.beforeOpen !== 'function') {
      return this._doOpen();
    }

    this.opts.beforeOpen(() => {
      this._doOpen();
    });
  }

  _doOpen(): void {
    addClass(document.body, this.opts.bodyClass);

    removeClass(this.dialog, this.opts.dialogCloseClass);
    addClass(this.dialog, this.opts.dialogOpenClass);

    this.overlay.style.display = 'block';

    if (this.opts.focus) {
      this.focusOutElement = document.activeElement as HTMLElement;
      this.focus();
    }

    if (typeof this.opts.afterOpen === 'function') {
      this.opts.afterOpen();
    }
    this.opened = true;
  }

  close(): void {
    if (typeof this.opts.beforeClose !== 'function') {
      return this._doClose();
    }

    this.opts.beforeClose(() => {
      this._doClose();
    });
  }

  _doClose(): void {
    removeClass(this.dialog, this.opts.dialogOpenClass);
    addClass(this.dialog, this.opts.dialogCloseClass);

    removeClass(document.body, this.opts.bodyClass);

    if (this.opts.focus) {
      this.focus(this.focusOutElement);
    }

    setTimeout(() => {
      this.overlay.style.display = 'none';

      if (typeof this.opts.afterClose === 'function') {
        this.opts.afterClose();
      }
      this.opened = false;
    }, this.opts.closeTimeout);
  }

  content(html?: string): string | void {
    if (html === undefined) {
      return this.dialog.innerHTML;
    }

    this.dialog.innerHTML = html;
  }

  elements(selector: string | string[], fallback?: boolean): HTMLElement[] {
    fallback = fallback || window.navigator.appVersion.indexOf('MSIE 9.0') > -1;
    selector = Array.isArray(selector) ? selector.join(',') : selector;

    return [].filter.call(
      this.dialog.querySelectorAll(selector),
      (element: HTMLElement) => {
        if (fallback) {
          const style = window.getComputedStyle(element);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }

        return element.offsetParent !== null;
      }
    );
  }

  focus(el?: HTMLElement | null): void {
    el = el || this.elements(this.opts.focusElements || '')[0] || this.dialog.firstChild;

    if (el && typeof el.focus === 'function') {
      el.focus();
    }
  }

  keydown(ev: KeyboardEvent): void {
    if (this.opts.escapeClose && ev.which == 27) {
      this.close();
    }

    const stopEvent = () => {
      ev.preventDefault();
      ev.stopPropagation();
    }

    if (this.opened && ev.which == 9 && this.dialog.contains(ev.target as Node)) {
      const elements = this.elements(this.opts.focusElements || ''),
        first = elements[0],
        last = elements[elements.length - 1];

      if (first == last) {
        stopEvent();
      } else if (ev.target == first && ev.shiftKey) {
        stopEvent();
        last.focus();
      } else if (ev.target == last && !ev.shiftKey) {
        stopEvent();
        first.focus();
      }
    }
  }
}

export default RModal;
