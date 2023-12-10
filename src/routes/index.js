const sheetController = require('../app/controllers/googleSheetController');
const emailController = require('../app/controllers/emailController');
function route(app) {
    app.get('/', (req, res) => {
        res.json("Hello, world!");
      })
    app.post('/email/send', emailController.send);
    app.post('/email/sendbill', emailController.sendBill);
      
    app.post('/sheet/update', sheetController.update);
}

module.exports = route