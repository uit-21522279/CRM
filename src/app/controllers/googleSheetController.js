
const fs = require('fs').promises;
const path = require('path');
const { JWT } = require('google-auth-library');
const { GoogleSpreadsheet } = require('google-spreadsheet')

const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKDuazc7qFGPYX\nCt3bNmMQ9WAnD7OrsYyoYBU8g4Av7OWNrJZhqL+AB1DveeOJXDxDlA+NseMcyBGk\nN9THhOdmjQvwDP2PzVtpr+c9tRdPz4HQuQuY4LMr+jkqgxsJ0bt9oktf06qqTllP\nG3H/Sz+I0mhZXgd0FH2laRiT6PBna2bT1fsorhqNg3BOD77qEVMSFWTX8epP/PdY\niVegYZFriRBdd0HNPHsgq/NDPRJT9R+riSiDFIbIadTKLy18/ua4zIibi+Q+n1vE\nnPmbPJTPpccpfZBCoPcg+qY4fl+1tH+NoQzrkKmb5WOuHo42quKJzNKu4XZGgsy6\nD8FD0Xs7AgMBAAECggEAY7+BcjuCa6xL6EosBcjOlROdOQtOVkcbOg/cy/fa803O\ncOcvgdyNVQXHlcEla60F7xKLrxaPGKlH1DrfpvNcTMr6hrHTBweIxh7ZWCQq8vJs\nkn6XVAwxR1eKmwsH8QwBs97HuPHEQbjV6/CPkUkzfzbn3p5Fra9j66F7SaFn9JU3\nG+/Rcv/dPT4wi49B0+zBofJ4J/19zIX33WgVDXUv2ebFFtEwCXyfKDU++VtF3bJf\nQX0AajJb/V/JIO+ExT7x94H4DkF3ZwkdXD7LfkGtmYfCZdbikzsyFnt1SoRY4ySA\n8aeWKQnwke3iUl3kQuXcsM0OJU3CfJCpv0ryODsSkQKBgQDor8ZpgHcYFLK+g1JU\nzObMMNg8C7097AD2V2mrJCc9Cc8shHVe2L2OsRRCjU+n77HTAk1v4TtYIv7xR4za\nnh8C2IsOilEPv9thMKl2mnxZUd3Ocwil6FryAr/Rpwoa1pz9XzaLNcFIE4cpGzEh\n+BE/JVrIbekLbWTnvDujKxLayQKBgQDeTYgr5qrdnyALfAqnxLKGsz/ZT5NNnrDO\nbGGHE918wG+3YapnnUC/kHNqvd6sJYNggduK/39CuxGIzRhyb6/4FNwociYDsMcX\n4j8MbjbKKe9ouGit2eI25D/A/AJ3Fu3CpyDRKiptgXLjDKeozVw/LDAmvJlvUPQg\n9FPtdLAj4wKBgFyvT5BMvKOZ8w0SECR5LeHd/vQEFRBqRoPZk9y43OxiUOTBqmLq\nYK9K9+/+i+EwCBwuCZxsEhBseDKxtniKjX27tcBH9jwYxxDyqj31EV0e0ARhK+uy\nHy/RSoj/SXYhUI1YdMiE1AWaybbk/vAx+OS3Q28c4LxNiekIwJShHrSJAoGBAKvg\niEthMnTd5lna0yY518p75v7vHrYh3xQLCjD1NAeThgzkT2uDUx+J4SMDoJm6+2Pv\noz5KIywGFR2Pbbp1DjoibsI615d848JcpGDJCkWuvLNb+VuJnfTQ71YXwxQuvzAE\nJkRydJFsR9ay3yKNfSg+0w/wPDWsAsVEA2wSD2n/AoGAFeEaES0GhKRxL0ml6x8g\nmj2yc4w2QKG21zordVISD+b3AGnFgz1p+Txre9goCZORAImMRfM+Po3Qo+sfbvAA\n0Uymy9a2SkWgpwvbpCHta5M0BT8E2FqdbhnR5jQH7ETdOFElX8MBa+hiTyMYhJ8r\nCRPLLw7FEHTHKM3inwa/pPI=\n-----END PRIVATE KEY-----\n";
const CLIENT_EMAIL = "update-sheet@i-agility-403603.iam.gserviceaccount.com";
const spreadsheetsId = "15ScOnsUPPdYvhrsFaGyEkiGbdYTFbNOx2K78LOjGptA";

class sheetController {

    async update(req, res) {
        const serviceAccountAuth = new JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });
        const doc = new GoogleSpreadsheet(spreadsheetsId, serviceAccountAuth);

        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        
        await sheet.addRow(
        {
            "Mã hóa đơn": req.body.invoice_code,
            "Mã sản phẩm": req.body.product_code,
            "Tên sản phẩm": req.body.product_name,
            "Số lượng": req.body.quantity,
            "Tên khách hàng": req.body.client_name,
            "Email": req.body.email,
            "Số điện thoại": req.body.phone,
            "Địa chỉ": req.body.location,
            "Ngày tạo hóa đơn": req.body.created_at,
            "Người tạo hóa đơn": req.body.employee,
            "Giá trị đơn hàng": req.body.total_price
        });
        return res.send("success");
    }
}

module.exports = new sheetController();