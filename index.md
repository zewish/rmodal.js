# rmodal.js
*A simple modal dialog with no external dependencies*

- A simple and fast modal dialog
- Plain JavaScript only - no dependencies
- All browsers supported (IE10+)
- Less than 1.2 KB when gzipped and minified
- Bootstrap and Animate.css friendly
- Supports CommonJS, AMD or globals

## Installation
```
npm install rmodal
```

## Usage
```js
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta charset="UTF-8" />

  <title>rmodal.js</title>

  <link rel="stylesheet" href="css/bootstrap.min.css" />
  <link rel="stylesheet" href="css/animate.css" type="text/css" />

  <link rel="stylesheet" href="src/rmodal.css" type="text/css" />
  <script type="text/javascript" src="src/rmodal.js"></script>

  <script type="text/javascript">
    window.onload = function() {
      var modal = new RModal(
        document.getElementById('modal'),
        options // See "Options" below details
      );

      document.addEventListener('keydown', function(ev) {
        modal.keydown(ev);
      }, false);

      document.getElementById('showModal').addEventListener("click", function(ev) {
        ev.preventDefault();
        modal.open();
      }, false);

      window.modal = modal;
    }
  </script>
</head>
<body>
  <div id="modal" class="modal">
    <div class="modal-dialog animated">
      <div class="modal-content">
        <form class="form-horizontal" method="get">
          <div class="modal-header">
            <strong>Hello Dialog</strong>
          </div>

          <div class="modal-body">
            Test Content
          </div>

          <div class="modal-footer">
            <button class="btn btn-primary" type="submit" onclick="modal.close();">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <a href="#" id="showModal" class="btn btn-success">Show modal</a>
</body>
</html>
```

## Options
```js
{
  content: 'This may be used to override all of the dialog inner html',
  closeTimeout: 500 // Time to wait (ms) before afterClose() is called

  /**
   * Callbacks
   */
  beforeOpen(next) {
    console.log('I will execute right before the dialog is shown');
    next();
  },
  afterOpen() {
    console.log('I will execute just after the dialog is shown');
  },
  beforeClose(next) {
    console.log('I will execute right before the dialog is closed');
    next();
  },
  afterClose() {
    console.log('I will execute just after the dialog is closed');
  }

  /**
   * Classes
   */

  // Added to body element clases while the modal is opened:
  bodyClass: 'modal-open',

  // Always added to dialog element classes:
  dialogClass: 'modal-dialog modal-dialog-lg',

  // Added to dialog element classes after it is opened:
  dialogOpenClass: 'animated fadeIn',

  // Added to dialog element classes before it is closed:
  dialogCloseClass: 'animated fadeOut',

  /**
   * Extra
   */

  // Set this to "false" to disable focus capture (tab/shift+tab):
  focus: true,

  // Set this to "false" to disable closing when escape key pressed:
  escapeClose: true
}
```
