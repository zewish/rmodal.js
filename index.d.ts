declare namespace RModal {
    export interface RModalOptions {
        afterClose?(): void;
        beforeOpen?(callback: Function): void;
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
}

declare class RModal {
    constructor(el: HTMLElement, opts?: RModalOptions);
    version: string;
    close(): void;
    content(content?: string): string | void;
    elements(selector: string | string[], fallback?: boolean): Array<HTMLElement>;
    focus(el?: HTMLElement): void;
    keydown(ev: KeyboardEvent): void;
    open(content?: string): void;
}

export = RModal;
