class formController {
    index(req,res) {
        console.log(req.body);
    }
}

module.exports = new formController();