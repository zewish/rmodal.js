(function(window, document) {
    "use strict";

    function is(obj, type) {
        return (Object.prototype.toString.call(obj).toLowerCase() === '[object ' + type + ']');
    }

    function addClass(element, elClass) {
        var classes = element.className.split(/\s+/);
        if (!classes[0]) {
            classes = [];
        }
        if (classes.indexOf(elClass) > -1) {
            return;
        }
        classes.push(elClass);
        element.className = classes.join(' ');
    }

    function removeClass(element, elClass) {
        var classes = element.className.split(/\s+/)
            , index = classes.indexOf(elClass);
        if (index > -1) {
            classes.splice(index, 1);
        }
        element.className = classes.join(' ');
    }

    function RModal(element, options) {
        this.opened = false;

        this.options = options || {};
        this.options.bodyClass = this.options.bodyClass || 'modal-open';
        this.options.dialogClass = this.options.dialogClass || 'modal-dialog';
        this.options.dialogOpenClass = this.options.dialogOpenClass || 'bounceInDown';
        this.options.dialogCloseClass = this.options.dialogCloseClass || 'bounceOutUp';

        if (this.options.escapeClose === undefined) {
            this.options.escapeClose = true;
        }

        this.options.focusElements = this.options.elements || [
            'a[href]', 'area[href]', 'input:not([disabled]):not([type=hidden])'
            , 'button:not([disabled])', 'select:not([disabled])'
            , 'textarea:not([disabled])', 'iframe', 'object', 'embed'
            , '*[tabindex]', '*[contenteditable]'
        ];
        if (this.options.focus === undefined) {
            this.options.focus = true;
        }
        this.focusOutElement = null;

        this.overlay = element;
        this.dialog = element.querySelector('.' + this.options.dialogClass);

        if (this.options.content !== undefined) {
            this.content(this.options.content);
        }
    }

    var proto = RModal.prototype;

    proto.open = function(content) {
        var self = this;
        this.content(content);

        if (is(this.options.beforeOpen, 'function')) {
            return this.options.beforeOpen(function() {
                self._doOpen();
            });
        }
        this._doOpen();
    };

    proto._doOpen = function() {
        var self = this;

        addClass(document.body, this.options.bodyClass);

        removeClass(this.dialog, this.options.dialogCloseClass);
        addClass(this.dialog, this.options.dialogOpenClass);

        this.overlay.style.display = 'block';

        if (this.options.focus) {
            this.focusOutElement = document.activeElement;
            this.focus();
        }

        if (is(this.options.afterOpen, 'function')) {
            this.options.afterOpen();
        }
        this.opened = true;
    };

    proto.close = function(ev) {
        var self = this;
        if (is(this.options.beforeClose, 'function')) {
            return this.options.beforeClose(function() {
                self._doClose();
            });
        }
        this._doClose();
    };

    proto._doClose = function() {
        var self = this;

        removeClass(this.dialog, this.options.dialogOpenClass);
        addClass(this.dialog, this.options.dialogCloseClass);

        removeClass(document.body, this.options.bodyClass);

        if (this.options.focus) {
            this.focus(this.focusOutElement);
        }

        if (is(this.options.afterClose, 'function')) {
            this.options.afterClose();
        }

        this.opened = false;
        setTimeout(function() {
            self.overlay.style.display = 'none';
        }, 500);
    };

    proto.content = function(content) {
        if (content === undefined) {
            return this.dialog.innerHTML;
        }
        this.dialog.innerHTML = content;
    };

    proto.elements = function(selector, fallback) {
        fallback = fallback || (window.navigator.appVersion.indexOf('MSIE 9.0') > -1);
        return [].filter.call(this._elementsAll(selector), function(element) {
            if (fallback) {
                var style = window.getComputedStyle(element);
                return (style.display !== 'none' && style.visibility !== 'hidden');
            }
            return (element.offsetParent !== null);
        });
    };

    proto._elementsAll = function(selector) {
        if (is(selector, 'array')) {
            selector = selector.join(',') || null;
        }
        return this.dialog.querySelectorAll(selector);
    };

    proto.focus = function(element) {
        element = element || this.elements(this.options.focusElements)[0] || this.dialog.firstChild;
        if (element && is(element.focus, 'function')) {
            element.focus();
        }
    };

    proto.keydown = function(ev) {
        if (this.options.escapeClose && ev.which == 27) {
            this.close();
        }

        function stopEvent() {
            ev.preventDefault();
            ev.stopPropagation();
        }

        if (this.opened && ev.which == 9 && this.dialog.contains(ev.target)) {
            var elements = this.elements(this.options.focusElements)
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
    };

    if (typeof module === 'object' && module.exports) {
        module.exports = RModal;
    }
    else {
        window.RModal = RModal;
    }
})(window, document);