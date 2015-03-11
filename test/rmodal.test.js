describe('RModal', function() {
    var overlay;
    beforeEach(function() {
        overlay = document.querySelector('body');
    });

    var dialog = {
        add: function() {
            var dialog = document.createElement('div');
            dialog.className = 'modal-dialog';
            overlay.appendChild(dialog);
        }
        , remove: function() {
            var dialog = overlay.querySelector('.modal-dialog');
            dialog.parentNode.removeChild(dialog);
        }
    };

    function create(opts) {
        return new RModal(overlay, opts);
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
            expect(instance.overlay).to.be.eql(overlay);
        });

        it('should assign "this.dialog" to null', function() {
            var instance = create();
            expect(instance.dialog).to.be.null;
        });

        it('should assign "this.dialog" to an HTMLElement', function() {
            dialog.add();
            var instance = create();
            expect(instance.dialog).to.be.instanceof(HTMLElement);
            dialog.remove();
        });

        it('should not call "this.content()"', function() {
            var spy = sinon.spy(RModal.prototype, 'content');
            var instance = create();

            expect(spy.calledOnce).to.be.false;
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
});
