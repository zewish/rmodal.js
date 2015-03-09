(function(window, document) {
    "use strict";

    function isFunction(obj) {
        return (Object.prototype.toString.call(obj) === '[object Function]');
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

        this.overlay = element;
        this.dialog = element.querySelector('.' + this.options.dialogClass);

        if (this.options.content !== undefined) {
            this.content(this.options.content);
        }
    }

    RModal.prototype.open = function(content) {
        var self = this;
        this.content(content);

        if (isFunction(this.options.beforeOpen)) {
            return this.options.beforeOpen(function() {
                self._doOpen();
            });
        }
        this._doOpen();
    };

    RModal.prototype._doOpen = function() {
        var self = this;

        addClass(document.querySelector('body'), this.options.bodyClass);

        removeClass(this.dialog, this.options.dialogCloseClass);
        addClass(this.dialog, this.options.dialogOpenClass);

        this.overlay.style.display = 'block';
        this.resize();
        if (isFunction(this.options.afterOpen)) {
            this.options.afterOpen();
        }
    };

    RModal.prototype.close = function(ev) {
        var self = this;
        if (isFunction(this.options.beforeClose)) {
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

        removeClass(document.querySelector('body'), this.options.bodyClass);

        if (isFunction(this.options.afterClose)) {
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

    window.RModal = RModal;

})(this, this.document);