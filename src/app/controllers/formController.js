const axios = require('axios');
class formController {
    async index(req,res) {
        console.log(req.body);

        let bodyData = req.body;

    // Handle improperly formatted JSON
    if (typeof bodyData === 'object' && Object.keys(bodyData).length === 1) {
        const singleKey = Object.keys(bodyData)[0];
        try {
            // Attempt to parse the single key as JSON
            bodyData = JSON.parse(singleKey);
        } catch (err) {
            console.error('Failed to parse JSON:', err);
            return res.status(400).send({ error: 'Invalid JSON payload' });
        }
    }

    console.log('Parsed req.body:', bodyData);

        let data = {
            "app_id": "cli_a7c687a4de38502f",
            "app_secret": "PkmEHKSHdsuZVzBAUBDIuJRBK5II8fHL"
        };
        var access_token = '';
        await axios.post('https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', data)
        .then(async (data) => {
            access_token = data.data.app_access_token;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token,
            } 
            let app_token  = 'Eq2cbJmZDabNTYsHALclrQdGgof';
            let table_id = 'tblGI9mq50xGkOj8';
            await axios.post(`https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`, {
                fields: {
                    "Email": bodyData.email,
                    "Giới tính": bodyData.gender,
                    "Số điện thoại": bodyData.phone,
                    "Tên khách hàng": bodyData.name,
                    "Vấn đề quan tâm": bodyData.ghichu,
                    "Loại khách hàng": bodyData.type,
                    "Địa chỉ": bodyData.location,
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