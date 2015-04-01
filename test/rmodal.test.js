describe('RModal', function() {
    var elBody
        , elOverlay
        , elDialog;

    var overlay = {
        add: function() {
            elOverlay = document.createElement('div');
            elOverlay.className = 'modal';
            elBody.appendChild(elOverlay);
        }
        , remove: function() {
            var elOverlay = elBody.querySelector('.modal');
            elOverlay.parentNode.removeChild(elOverlay);
        }
    };

    var dialog = {
        add: function() {
            elDialog = document.createElement('div');
            elDialog.className = 'modal-dialog';
            elOverlay.appendChild(elDialog);
        }
        , remove: function() {
            var elDialog = elOverlay.querySelector('.modal-dialog');
            elDialog.parentNode.removeChild(elDialog);
        }
    };

    beforeEach(function() {
        elBody = document.querySelector('body');
        overlay.add();
        dialog.add();
    });

    afterEach(function() {
        dialog.remove();
        overlay.remove();
    });

    function create(opts) {
        return new RModal(elOverlay, opts);
    }

    describe('RModal()', function() {
        it('should set "this.options" to an object if it is not provided', function() {
            var instance = create(undefined);
            expect(instance.options).to.be.an('object');
        });

        it('should set defaults for "this.options" properties when not provided', function() {
            var instance = create();
            expect(instance.options.bodyClass).to.equal('modal-open');
            expect(instance.options.dialogClass).to.equal('modal-dialog');
            expect(instance.options.dialogOpenClass).to.equal('bounceInDown');
            expect(instance.options.dialogCloseClass).to.equal('bounceOutUp');

            expect(instance.options.focus).to.be.true;
            expect(instance.options.focusElements).to.eql([
                'a[href]', 'area[href]', 'input:not([disabled]):not([type=hidden])'
                , 'button:not([disabled])', 'select:not([disabled])'
                , 'textarea:not([disabled])', 'iframe', 'object', 'embed'
                , '*[tabindex]', '*[contenteditable]'
            ]);

            expect(instance.options.escapeClose).to.be.true;
        });

        it('should set "this.options" properties when provided', function() {
            var opts = {
                bodyClass: 'custom-body-class'
                , dialogClass: 'custom-dialog-class'
                , dialogOpenClass: 'custom-dialog-open-class'
                , dialogCloseClass: 'custom-dialog-close-class'

                , focus: true
                , focusElements: ['my', 'custom', 'elements']

                , escapeClose: false
            };
            var instance = create(opts);

            expect(instance.options.bodyClass).to.equal(opts.bodyClass);
            expect(instance.options.dialogClass).to.equal(opts.dialogClass);
            expect(instance.options.dialogOpenClass).to.equal(opts.dialogOpenClass);
            expect(instance.options.dialogCloseClass).to.equal(opts.dialogCloseClass);

            expect(instance.options.focus).to.equal(opts.focus);
            expect(instance.options.focusElements).to.equal(opts.focusElements);

            expect(instance.options.escapeClose).to.be.equal(opts.escapeClose);
        });

        it('should set "this.focusOutElement" to null', function() {
            var instance = create();
            expect(instance.focusOutElement).to.be.null;
        });

        it('should assign "this.overlay" reference to the "element" param', function() {
            var instance = create();
            expect(instance.overlay).to.be.eql(elOverlay);
        });

        it('should assign "this.dialog" to an HTMLElement', function() {
            var instance = create();
            expect(instance.dialog).to.be.instanceof(HTMLElement);
        });

        it('should not call "this.content()"', function() {
            var stub = sinon.stub(RModal.prototype, 'content');
            var instance = create();

            expect(stub.calledOnce).to.be.false;
            RModal.prototype.content.restore();
        });

        it('should call "this.content()" with "this.options.content" as a param', function() {
            var stub = sinon.stub(RModal.prototype, 'content');
            var instance = create({
                content: 'test content'
            });

            expect(
                stub.withArgs(instance.options.content).calledOnce
            ).to.be.true;
            RModal.prototype.content.restore();
        });
    });

    describe('open()', function() {
        it('should call "this.content()" with "this.options.content" as param', function() {
            var stub = sinon.stub(RModal.prototype, 'content');
            var instance = create({
                content: 'dummy content'
            });
            instance.open();

            expect(
                stub.withArgs('dummy content').calledOnce
            ).to.be.true;
            RModal.prototype.content.restore();
        });

        it('should call "this.options.beforeOpen" if it is a function"', function() {
            var spy = sinon.spy(function(next) {
                next();
            });
            var instance = create({
                beforeOpen: spy
            });

            instance.open();
            expect(spy.calledOnce).to.be.true;
        });

        it('should call "this._doOpen()"', function() {
            var spy = sinon.spy(RModal.prototype, '_doOpen');
            var instance = create({
                beforeOpen: function(next) {
                    next();
                }
            });
            instance.open();
            expect(spy.calledOnce).to.be.true;

            instance = create();
            instance.open();
            expect(spy.calledTwice).to.be.true;
            RModal.prototype._doOpen.restore();
        });
    });

    describe('_doOpen()', function() {
        it('should add "this.options.bodyClass" to body.className', function() {
            elBody.className = 'default-class';
            var instance = create({
                bodyClass: 'test-class'
            });

            instance._doOpen();
            expect(elBody.className).to.be.equal(
                'default-class ' + instance.options.bodyClass
            );
        });

        it('should remove "this.options.dialogCloseClass" from dialog.className', function() {
            elDialog.className = 'modal-dialog dialog-class1 close-class';
            var instance = create({
                dialogCloseClass: 'close-class'
            });

            instance._doOpen();
            expect(instance.dialog.className).to.be.equal(
                'modal-dialog dialog-class1 bounceInDown'
            );
        });

        it('should add "this.options.dialogOpenClass" from dialog.className', function() {
            elDialog.className = 'modal-dialog dialog-class2';
            var instance = create({
                dialogOpenClass: 'open-class'
            });

            instance._doOpen();
            expect(instance.dialog.className).to.be.equal(
                'modal-dialog dialog-class2 open-class'
            );
        });

        it('should set "this.overlay.style.display" to "block"', function() {
            elOverlay.style.display = 'none';
            var instance = create();

            instance._doOpen();
            expect(instance.overlay.style.display).to.be.equal('block');
        });

        it('should set "this.focusOutElement" to "document.activeElement"', function() {
            var expected = document.activeElement;
            var instance = create();

            instance._doOpen();
            expect(instance.focusOutElement).to.be.eql(expected);
        });

        it('should call "this.focus()"'
            , function() {
                var instance = create();
                var spy = sinon.spy(RModal.prototype, 'focus');

                instance._doOpen();
                expect(spy.calledOnce).to.be.true;

                RModal.prototype.focus.restore();
            }
        );

        it('should not call "this.focus()"'
            , function() {
                var instance = create({
                    focus: false
                });
                var spy = sinon.spy(RModal.prototype, 'focus');

                instance._doOpen();
                expect(spy.calledOnce).to.be.false;

                RModal.prototype.focus.restore();
            }
        );

        it('should call "this.options.afterOpen" if it is a function"', function() {
            var spy = sinon.spy();
            var instance = create({
                afterOpen: spy
            });

            instance._doOpen();
            expect(spy.calledOnce).to.be.true;
        });
    });

    describe('close()', function() {
        it('should call "this.options.beforeClose" if it is a function"', function() {
            var spy = sinon.spy(function(next) {
                next();
            });
            var instance = create({
                beforeClose: spy
            });

            instance.close();
            expect(spy.calledOnce).to.be.true;
        });

        it('should call "this._doClose()"', function() {
            var spy = sinon.spy(RModal.prototype, '_doClose');
            var instance = create({
                beforeClose: function(next) {
                    next();
                }
            });
            instance.close();
            expect(spy.calledOnce).to.be.true;

            instance = create();
            instance.close();
            expect(spy.calledTwice).to.be.true;
            RModal.prototype._doClose.restore();
        });
    });

    describe('_doClose()', function() {
        it('should remove "this.options.dialogOpenClass" from dialog.className', function() {
            elDialog.className = 'modal-dialog dialog-class3 open-class';
            var instance = create({
                dialogOpenClass: 'open-class'
            });

            instance._doClose();
            expect(instance.dialog.className).to.be.equal(
                'modal-dialog dialog-class3 bounceOutUp'
            );
        });

        it('should add "this.options.dialogCloseClass" from dialog.className', function() {
            elDialog.className = 'modal-dialog dialog-class4';
            var instance = create({
                dialogCloseClass: 'close-class'
            });

            instance._doClose();
            expect(instance.dialog.className).to.be.equal(
                'modal-dialog dialog-class4 close-class'
            );
        });

        it('should remove "this.options.bodyClass" from body.className', function() {
            elBody.className = 'default-body-class modal-open-class';
            var instance = create({
                bodyClass: 'modal-open-class'
            });

            instance._doClose();
            expect(elBody.className).to.be.equal('default-body-class');
        });

        it('should call "this.focus()" with "this.focusOutElement" as param', function() {
            var instance = create();
            var spy = sinon.spy(RModal.prototype, 'focus');

            instance._doClose();
            expect(
                spy.withArgs(instance.focusOutElement).calledOnce
            ).to.be.true;
            RModal.prototype.focus.restore();
        });

        it('should not call "this.focus()"', function() {
            var instance = create({
                focus: false
            });
            var spy = sinon.spy(RModal.prototype, 'focus');

            instance._doClose();
            expect(
                spy.withArgs(instance.focusOutElement).calledOnce
            ).to.be.false;
            RModal.prototype.focus.restore();
        });

        it('should call "this.options.afterClose" if it is a function"', function() {
            var spy = sinon.spy();
            var instance = create({
                afterClose: spy
            });

            instance._doClose();
            expect(spy.calledOnce).to.be.true;
        });

        it('should call set "this.overlay.style.display" to "none"', function() {
            var timers = sinon.useFakeTimers();
            var instance = create();

            instance._doClose();
            timers.tick(500);
            expect(instance.overlay.style.display).to.be.equal('none');
            timers.restore();
        });
    });

    describe('content()', function() {
        it('should return this.dialog.innerHTML', function() {
            var instance = create();
            elDialog.innerHTML = 'testing';

            expect(instance.content()).to.be.equal(elDialog.innerHTML);
        });

        it('should change this.dialog.innerHTML if a param is passed', function() {
            var instance = create();
            instance.content('testing2');

            expect(elDialog.innerHTML).to.be.equal('testing2')
        });
    });

    describe('elements()', function() {
        it('should call "this._elementsAll" passing the "selector" param', function () {
            var spy = sinon.spy(RModal.prototype, '_elementsAll');
            var instance = create();

            instance.elements('selector0');
            expect(
                spy.withArgs('selector0').calledOnce
            ).to.be.true;

            RModal.prototype._elementsAll.restore();
        });

        it('should filter and return only visible elements', function() {
            elDialog.style.position = 'relative';
            elDialog.innerHTML =
                '<input type="hidden" alt="invisible" />'
                + '<input type="text" value="I am invisible" style="display: none;" />'
                + '<input type="text" value="I am visible" />';

            var instance = create();

            var elems = instance.elements(instance.options.focusElements);
            expect(elems[0]).to.eql(elDialog.children[2]);
            expect(elems.length).to.be.equal(1);
        });

        it('should filter and return only visible elements (IE9)', function() {
            elDialog.style.position = 'relative';
            elDialog.innerHTML =
                '<input type="hidden" alt="invisible" />'
                + '<input type="text" value="I am invisible" style="display: none;" />'
                + '<input type="text" value="I am visible" />';

            var instance = create();
            var elems = instance.elements(instance.options.focusElements, true);
            expect(elems[0]).to.eql(elDialog.children[2]);
            expect(elems.length).to.be.equal(1);
        });
    });

    describe('_elementsAll()', function() {
        it('should call "this.dialog.querySelectorAll()" with joined "selector" param', function() {
            var instance = create();
            var spy = sinon.spy(instance.dialog, 'querySelectorAll');

            instance._elementsAll([
                'selector1'
                , 'selector2'
                , 'selector3'
            ]);
            expect(
                spy.withArgs('selector1,selector2,selector3').calledOnce
            ).to.be.true;

            instance.dialog.querySelectorAll.restore();
        });

        it('should call "this.dialog.querySelectorAll()" with null as a param', function() {
            var instance = create();
            var spy = sinon.spy(instance.dialog, 'querySelectorAll');

            instance._elementsAll([]);
            expect(
                spy.withArgs(null).calledOnce
            ).to.be.true;

            instance.dialog.querySelectorAll.restore();
        });

        it('should call "this.dialog.querySelectorAll()" with the "selector" param', function() {
            var instance = create();
            var spy = sinon.spy(instance.dialog, 'querySelectorAll');

            instance._elementsAll('selector1');
            expect(
                spy.withArgs('selector1').calledOnce
            ).to.be.true;

            instance.dialog.querySelectorAll.restore();
        });
    });

    describe('focus()', function() {
        it ('should call "this.element(this.options.focusElements)"', function() {
            var spy = sinon.spy(RModal.prototype, 'elements');
            var instance = create();

            instance.focus();
            expect(spy.withArgs(instance.options.focusElements).calledOnce).to.be.true;
            RModal.prototype.elements.restore();
        });

        it('should call "element.focus()"', function() {
            elDialog.innerHTML = '<input type="text" class="test" />';
            var el = elDialog.querySelector('input.test');

            var spy = sinon.spy(el, 'focus');
            var instance = create();

            instance.focus(el);
            expect(spy.calledOnce).to.be.true;
        });

        it('should call "this.dialog.firstChild.focus()"', function() {
            var instance = create({
                focus: []
            });

            elDialog.innerHTML = '<input type="text" />';
            var spy = sinon.spy(instance.dialog.firstChild, 'focus');

            instance.focus();
            expect(spy.calledOnce).to.be.true;
        });
    });

    describe('keydown()', function() {
        var stubDialogContains;
        beforeEach(function() {
            stubDialogContains = sinon.stub(elDialog, 'contains').returns(true);
        });

        afterEach(function() {
            elDialog.contains.restore();
        })

        it('should call "this.close()" on escape', function() {
            var spy = sinon.spy(RModal.prototype, 'close');
            var instance = create();
            instance.keydown({
                which: 27
            });

            expect(spy.calledOnce).to.be.true;
            RModal.prototype.close.restore();
        });

        it('should not call "this.close()" on escape', function() {
            var spy = sinon.spy(RModal.prototype, 'close');
            var instance = create({
                escapeClose: false
            });
            instance.keydown({
                which: 27
            });

            expect(spy.calledOnce).to.be.false;
            RModal.prototype.close.restore();
        });

        it('should call "this.dialog.contains()"', function() {
            var instance = create();
            instance.opened = true;

            instance.keydown({
                which: 9
                , preventDefault: function() {}
                , stopPropagation: function() {}
            });
            expect(
                stubDialogContains.calledOnce
            ).to.be.true;
        });

        it('should call "this.elements(this.option.focusElements)" on tab', function() {
            var spy = sinon.spy(RModal.prototype, 'elements');
            var instance = create();
            instance.opened = true;

            instance.keydown({
                which: 9
                , preventDefault: function() {}
                , stopPropagation: function() {}
            });
            expect(
                spy.withArgs(instance.options.focusElements).calledOnce
            ).to.be.true;
            RModal.prototype.elements.restore();
        });

        it('should call "stopEvent()"', function() {
            var stub = sinon.stub(RModal.prototype, 'elements')
            .returns([ '1', '1' ]);

            var instance = create();
            instance.opened = true;

            var ev = {
                which: 9
                , preventDefault: sinon.spy()
                , stopPropagation: sinon.spy()
            };
            instance.keydown(ev);

            expect(ev.preventDefault.calledOnce).to.be.true;
            expect(ev.stopPropagation.calledOnce).to.be.true;

            RModal.prototype.elements.restore();
        });

        it('should call "stopEvent()" and "last.focus()"', function() {
            var spy = sinon.spy();
            var stub = sinon.stub(RModal.prototype, 'elements')
            .returns([
                'first'
                , { focus: spy }
            ]);

            var instance = create();
            instance.opened = true;

            var ev = {
                which: 9
                , shiftKey: true
                , target: 'first'
                , preventDefault: sinon.spy()
                , stopPropagation: sinon.spy()
            };
            instance.keydown(ev);

            expect(ev.preventDefault.calledOnce).to.be.true;
            expect(ev.stopPropagation.calledOnce).to.be.true;
            expect(spy.calledOnce).to.be.true;

            RModal.prototype.elements.restore();
        });

        it('should call "stopEvent()" and "first.focus()"', function() {
            var spy = sinon.spy();
            var stub = sinon.stub(RModal.prototype, 'elements')
            .returns([
                { focus: spy }
                , 'last'
            ]);

            var instance = create();
            instance.opened = true;

            var ev = {
                which: 9
                , shiftKey: false
                , target: 'last'
                , preventDefault: sinon.spy()
                , stopPropagation: sinon.spy()
            };
            instance.keydown(ev);

            expect(ev.preventDefault.calledOnce).to.be.true;
            expect(ev.stopPropagation.calledOnce).to.be.true;
            expect(spy.calledOnce).to.be.true;

            RModal.prototype.elements.restore();
        });

        it('should not call "stopEvent()"', function() {
            var stub = sinon.stub(RModal.prototype, 'elements')
            .returns([
                1, 2, 3
            ]);

            var instance = create();
            instance.opened = true;

            var ev = {
                which: 9
                , preventDefault: sinon.spy()
                , stopPropagation: sinon.spy()
            };
            instance.keydown(ev);

            expect(ev.preventDefault.calledOnce).to.be.false;
            expect(ev.stopPropagation.calledOnce).to.be.false;

            RModal.prototype.elements.restore();
        });
    });

    it('should export RModal constructor', function() {
        expect(window.RModal).to.be.a('function');
    });
});