'use strict';

let is = (obj, type) => Object.prototype.toString.call(obj).toLowerCase() === `[object ${type}]`;

let addClass = (el, cls) => {
    let arr = el.className
    .split(/\s+/)
    .filter((c) => !!c && c == cls);

    if (!arr.length) {
        el.className += ` ${cls}`;
    }
}

let removeClass = (el, cls) => {
    el.className = el.className
    .split(/\s+/)
    .filter((c) => !!c && c != cls)
    .join(' ');
}

class RModal {
    constructor(el, opts) {
        this.opened = false;

        this.opts = {
            bodyClass: 'modal-open'
            , dialogClass: 'modal-dialog'
            , dialogOpenClass: 'bounceInDown'
            , dialogCloseClass: 'bounceOutUp'

            , focus: true
            , focusElements: [
                'a[href]', 'area[href]', 'input:not([disabled]):not([type=hidden])'
                , 'button:not([disabled])', 'select:not([disabled])'
                , 'textarea:not([disabled])', 'iframe', 'object', 'embed'
                , '*[tabindex]', '*[contenteditable]'
            ]

            , escapeClose: true
            , content: null
        };

        Object.keys(opts || {})
        .forEach((key) => {
            /* istanbul ignore else */
            if (opts[key] !== undefined) {
                this.opts[key] = opts[key];
            }
        });

        this.overlay = el;
        this.dialog = el.querySelector(`.${this.opts.dialogClass}`);

        if (this.opts.content) {
            this.content(this.opts.content);
        }
    }

    open(content) {
        this.content(content);

        if (!is(this.opts.beforeOpen, 'function')) {
            return this._doOpen();
        }

        this.opts.beforeOpen(() => {
            this._doOpen();
        });
    }

    _doOpen() {
        addClass(document.body, this.opts.bodyClass);

        removeClass(this.dialog, this.opts.dialogCloseClass);
        addClass(this.dialog, this.opts.dialogOpenClass);

        this.overlay.style.display = 'block';

        if (this.opts.focus) {
            this.focusOutElement = document.activeElement;
            this.focus();
        }

        if (is(this.opts.afterOpen, 'function')) {
            this.opts.afterOpen();
        }
        this.opened = true;
    }

    close() {
        if (!is(this.opts.beforeClose, 'function')) {
            return this._doClose();
        }

        this.opts.beforeClose(() => {
            this._doClose();
        });
    }

    _doClose() {
        removeClass(this.dialog, this.opts.dialogOpenClass);
        addClass(this.dialog, this.opts.dialogCloseClass);

        removeClass(document.body, this.opts.bodyClass);

        if (this.opts.focus) {
            this.focus(this.focusOutElement);
        }

        if (is(this.opts.afterClose, 'function')) {
            this.opts.afterClose();
        }

        this.opened = false;
        setTimeout(() => {
            this.overlay.style.display = 'none';
        }, 500);
    }

    content(content) {
        if (content === undefined) {
            return this.dialog.innerHTML;
        }

        this.dialog.innerHTML = content;
    }

    elements(selector, fallback) {
        fallback = fallback || window.navigator.appVersion.indexOf('MSIE 9.0') > -1;
        selector = is(selector, 'array') ? selector.join(',') : selector;

        return [].filter.call(
            this.dialog.querySelectorAll(selector)
            , (element) => {
                if (fallback) {
                    var style = window.getComputedStyle(element);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                }

                return element.offsetParent !== null;
            }
        );
    }

    focus(el) {
        el = el || this.elements(this.opts.focusElements)[0] || this.dialog.firstChild;

        if (el && is(el.focus, 'function')) {
            el.focus();
        }
    }

    keydown(ev) {
        if (this.opts.escapeClose && ev.which == 27) {
            this.close();
        }

        function stopEvent() {
            ev.preventDefault();
            ev.stopPropagation();
        }

        if (this.opened && ev.which == 9 && this.dialog.contains(ev.target)) {
            var elements = this.elements(this.opts.focusElements)
                , first = elements[0]
                , last = elements[elements.length - 1];

            if (first == last) {
                stopEvent();
            }
            else if (ev.target == first && ev.shiftKey) {
                stopEvent();
                last.focus();
            }
            else if (ev.target == last && !ev.shiftKey) {
                stopEvent();
                first.focus();
            }
        }
    }
}

RModal.prototype.version = '@@VERSION@@';
RModal.version = '@@VERSION@@';

export default RModal;