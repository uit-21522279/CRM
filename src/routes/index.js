const sheetController = require('../app/controllers/googleSheetController');
const emailController = require('../app/controllers/emailController');
const formController = require('../app/controllers/formController');
function route(app) {
    app.get('/', (req, res) => {
        res.json("Hello, world!");
      })
    app.post('/email/send', emailController.send);
    app.get('/sheet/update', sheetController.update);
    app.post('/sheet/update', sheetController.update);
    app.post('/contact', formController.index);
    app.post('/email/status', emailController.status);
}

module.exports = route