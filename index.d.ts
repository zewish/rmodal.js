interface RModalOptions {
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
declare class RModal {
    static version: string;
    version: string;
    overlay: HTMLElement;
    dialog: HTMLElement;
    focusOutElement: HTMLElement | null;
    opened: boolean;
    opts: RModalOptions;
    constructor(el: HTMLElement, opts?: RModalOptions);
    open(content: string): void;
    _doOpen(): void;
    close(): void;
    _doClose(): void;
    content(html?: string): string | void;
    elements(selector: string | string[], fallback?: boolean): HTMLElement[];
    focus(el?: HTMLElement | null): void;
    keydown(ev: KeyboardEvent): void;
}
export { RModal as default, RModalOptions };
