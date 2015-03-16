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
        var self = this;

        this.options = options || {};
        this.options.bodyClass = this.options.bodyClass || 'modal-open';
        this.options.dialogClass = this.options.dialogClass || 'modal-dialog';
        this.options.dialogOpenClass = this.options.dialogOpenClass || 'bounceInDown';
        this.options.dialogCloseClass = this.options.dialogCloseClass || 'bounceOutUp';

        if (this.options.focus === undefined) {
            this.options.focus = ['input', 'select', 'textarea', 'button'];
        }
        this.focusOutElement = null;

        this.overlay = element;
        this.dialog = element.querySelector('.' + this.options.dialogClass);

        if (this.options.content !== undefined) {
            this.content(this.options.content);
        }
    }

    RModal.prototype.open = function(content) {
        var self = this;
        this.content(content);

        if (is(this.options.beforeOpen, 'function')) {
            return this.options.beforeOpen(function() {
                self._doOpen();
            });
        }
        this._doOpen();
    };

    RModal.prototype._doOpen = function() {
        var self = this;

        addClass(document.body, this.options.bodyClass);

        removeClass(this.dialog, this.options.dialogCloseClass);
        addClass(this.dialog, this.options.dialogOpenClass);

        this.overlay.style.display = 'block';
        this.resize();

        if (this.options.focus) {
            this.focusOutElement = document.activeElement;
            this.focus(this.element(this.options.focus));
        }

        if (is(this.options.afterOpen, 'function')) {
            this.options.afterOpen();
        }
    };

    RModal.prototype.close = function(ev) {
        var self = this;
        if (is(this.options.beforeClose, 'function')) {
            return this.options.beforeClose(function() {
                self._doClose();
            });
        }
        this._doClose();
    };

    RModal.prototype._doClose = function() {
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

        setTimeout(function() {
            self.overlay.style.display = 'none';
        }, 500);
    };

    RModal.prototype.content = function(content) {
        if (content === undefined) {
            return this.dialog.innerHTML;
        }
        this.dialog.innerHTML = content;
    };

    RModal.prototype.resize = function() {
        var overlayWidth = window.innerWidth;
        var overlayHeight = window.innerHeight;
        if (document.body.clientHeight > window.innerHeight) {
            overlayWidth = document.body.clientWidth;
            overlayHeight = document.body.clientHeight;
        }

        this.overlay.style.width = overlayWidth + 'px';
        this.overlay.style.height = overlayHeight + 'px';
    };

    RModal.prototype.element = function(selector) {
        if (is(selector, 'array')) {
            selector = selector.join(',');
        }
        return this.dialog.querySelectorAll(selector)[0];
    };

    RModal.prototype.focus = function(element) {
        element = element || this.dialog.firstChild;
        if (element && is(element.focus, 'function')) {
            element.focus();
        }
    };

    window.RModal = RModal;
})(this, this.document);