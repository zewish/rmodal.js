(function(window, document, undefined) {

    function isFunction(obj) {
        return (Object.prototype.toString.call(obj) === '[object Function]');
    }

    function stopPropagation(ev) {
        var ev = ev || window.event;
        if (ev.stopPropagation) {
            ev.stopPropagation();
        }
        if (ev.cancelBubble != null) {
            ev.cancelBubble = true;
        }
    }

    function RModal(element, options) {
        var self = this;
        this.options = options;

        this.overlay = element;

        this.dialogClass = options.dialogClass || 'modal-dialog';
        this.dialog = element.querySelector('.modal-dialog');

        if (this.options.content !== undefined) {
            this.content(this.options.content);
        }

        if (this.options.overlayClose === false) {
            return;
        }

        this.overlay.addEventListener('click', function() {
            self.close();
        }, false);

        this.dialog.addEventListener('click', function(ev) {
            stopPropagation(ev);
        }, false);
    };

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

        this.dialog.className = (this.options.openClass || 'animated bounceInDown') + ' ' + this.dialogClass;
        this.overlay.style.display = 'block';

        this.resize();
        if (isFunction(this.options.afterOpen)) {
            this.options.afterOpen();
        }
    }

    RModal.prototype.close = function(ev) {
        var self = this;
        if (isFunction(this.options.beforeClose)) {
            this.options.beforeClose(function() {
                self._doClose();
            });
            return stopPropagation(ev);
        }
        this._doClose();
        return stopPropagation();
    };

    RModal.prototype._doClose = function() {
        var self = this;
        this.dialog.className = (this.options.closeClass || 'animated bounceOutUp') + ' ' + this.dialogClass;

        if (isFunction(this.options.afterClose)) {
            this.options.afterClose();
        }

        setTimeout(function() {
            self.overlay.style.display = 'none';
        }, 500);
    }

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

        this.dialog.style.left = ((overlayWidth - this.dialog.clientWidth) / 2) + 'px';
    };

    window.RModal = RModal;

})(this, this.document);