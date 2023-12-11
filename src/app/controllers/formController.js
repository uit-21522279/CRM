const axios = require('axios');
class formController {
    async index(req,res) {
        console.log(req.body);
        let data = {
            "app_id": "cli_a5fda5d27138502f",
            "app_secret": "UUF5ku27wbxk2QpW0CUjEbdqLIbzMLZV"
        };
        var access_token = '';
        await axios.post('https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', data)
        .then(async (data) => {
            access_token = data.data.app_access_token;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token,
            } 
            let app_token  = 'VXdCbVJRGa5UHisRpyflm3lIgAd';
            let table_id = 'tbljqk5C4t07ThjI';
            await axios.post(`https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`, {
                fields: {
                    'Tên khách hàng': req.body.name,
                    'Email': req.body.email,
                    'Giới tính': req.body.gender ,
                    'Số điện thoại': req.body.phone,
                    'Địa chỉ': req.body.location,
                    'Ghi chú': req.body.ghichu
                }
            }, {
                headers: headers
            }).then(data => {
                console.log("success");
            }).catch(err => {console.log(err);});
        })
        .catch(err => {
            console.log(err);
        })
        
    }
}


module.exports = new formController();