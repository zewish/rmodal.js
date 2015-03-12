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
        });

        it('should set "this.options" properties when provided', function() {
            var opts = {
                bodyClass: 'custom-body-class'
                , dialogClass: 'custom-dialog-class'
                , dialogOpenClass: 'custom-dialog-open-class'
                , dialogCloseClass: 'custom-dialog-close-class'
            };
            var instance = create(opts);

            expect(instance.options.bodyClass).to.equal(opts.bodyClass);
            expect(instance.options.dialogClass).to.equal(opts.dialogClass);
            expect(instance.options.dialogOpenClass).to.equal(opts.dialogOpenClass);
            expect(instance.options.dialogCloseClass).to.equal(opts.dialogCloseClass);
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

        it('should call "this.resize()"', function() {
            var stub = sinon.stub(RModal.prototype, 'resize');
            var instance = create();

            instance._doOpen();
            expect(stub.calledOnce).to.be.true;
            RModal.prototype.resize.restore();
        });

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

    describe('resize()', function() {
        it('should set "this.overlay.style[width,height]" to "window[innerWidth,innerHeight]"'
            , function() {
                var instance = create();

                elBody.clientHeight = 312;
                elBody.clientWidth = 422;

                window.innerHeight = 531;
                window.innerWidth = 542;

                instance.resize();

                expect(instance.overlay.style.width).to.be.equal(window.innerWidth + 'px');
                expect(instance.overlay.style.height).to.be.equal(window.innerHeight + 'px');
            }
        );

        it('should set "this.overlay.style[width,height]" to "body[clientWidth,clientHeight]"'
            , function() {
                var instance = create();

                elDialog.innerHTML = '<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>';
                window.innerHeight = 123;
                window.innerWidth = 182;

                instance.resize();

                expect(instance.overlay.style.width).to.be.equal(elBody.clientWidth + 'px');
                expect(instance.overlay.style.height).to.be.equal(elBody.clientHeight + 'px');
            }
        );
    });

    it('should export RModal constructor', function() {
        expect(window.RModal).to.be.a('function');
    });
});
