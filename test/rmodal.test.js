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

        it('should export RModal constructor', function() {
            expect(window.RModal).to.be.a('function');
        });
    });

    describe('open()', function() {
        it('should call "this.content()" with undefined as param', function() {
            var stub = sinon.stub(RModal.prototype, 'content');
            var instance = create();
            instance.open();

            expect(
                stub.withArgs(undefined).calledOnce
            ).to.be.true;
            RModal.prototype.content.restore();
        });

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
                bodyClass: 'some test classes'
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
});
