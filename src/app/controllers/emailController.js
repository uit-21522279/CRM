const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const axios = require('axios');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { 
    user: '21522279@gm.uit.edu.vn', // email của bên gửi
    pass: 'pmmm jpxl pvpr yral'
    }
});

let data = {
    "app_id": "cli_a7c687a4de38502f",
    "app_secret": "PkmEHKSHdsuZVzBAUBDIuJRBK5II8fHL"
};
var access_token = '';
axios.post('https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', data)
.then(async (data) => {
    access_token = data.data.app_access_token;
})


class emailController {
    send(req, res) {
            const userAccessToken = 't-g206c58LWJ5UJXRAIKYORRHNI525SVFQVKNKSTQH'
            // Kiểm tra dữ liệu gửi đến có phải là form-data không
            if (access_token === userAccessToken) {
            if (req.body) {
                // Lấy trường email và payment_code từ request
                const email = req.body.email
                const paymentCode = req.body.paymentcode
                const value = req.body.value
                const staff =req.body.staff
                const mailOptions = {
                    from: 'ERP.nhacungcap1@gmail.com', // đại chỉ bên gửi
                    to: email ,// địa chỉ bên nhận
                    subject: `Cảm ơn quý khách đã thanh toán hóa đơn ${paymentCode}`,
                    text: 'Kính gửi quý khách hàng,' + '\n'
                        + `Tôi là ${staff} đến từ công ty Ancol  \n`
                        +`Chúng tôi đã nhận thanh toán Hóa đơn ${paymentCode} với trị giá ${value} \n`
                        + `Đơn hàng sản phẩm ${paymentCode} đã được hoàn thành `
                        + "Chúng tôi cảm ơn quý khách vì đã yêu quý và ủng hộ chúng tôi "
                        + "\n"
                        + "Chúc quý khách hàng một ngày thật vui vẻ\n"
                        + "Người gửi,\n"
                        + `${staff}`
                        + "\t"
                }; //nội dung email
            
                transporter.sendMail(mailOptions,async function(error, info) {
                    if (error) {
                        console.log(error);
                        return "error" + error.message; 
                    } else {
                        console.log('Email sent: ' + info.response);
                        return "Success" + info.response;
                    }
                })
                // In ra giá trị của email và payment_code
                console.log(`Email: ${email}`);
                console.log(`Payment Code: ${paymentCode}`);
            } else {
                console.log("Không có dữ liệu gửi đến.");
            }
        }
        else {
            // Token không hợp lệ
            res.status(401).send("Access Token không hợp lệ.");
          }

        // const transporter = nodemailer.createTransport({
        //     service: 'Gmail',
        //     auth: {
        //     user: 'ERP.nhacungcap1@gmail.com', // email của bên gửi
        //     pass: 'mhzoeojbvpimgjvj'
        //     }
        // });
    }

    status(req, res) {
    const userAccessToken = 't-g206c58LWJ5UJXRAIKYORRHNI525SVFQVKNKSTQH'
            
            // Kiểm tra dữ liệu gửi đến có phải là form-data không
            if (access_token === userAccessToken) {
            if (req.body) {
                // Lấy trường email và payment_code từ request
                const email = req.body.email
                const trangthai = req.body.trangthai
                const orderId= req.body.orderId
                const value=req.body.value
                const mailOptions = {
                    from: 'ERP.nhacungcap1@gmail.com', // đại chỉ bên gửi
                    to: email ,// địa chỉ bên nhận
                    subject: `Cập nhật trạng thái đơn hàng ${orderId} `,
                    text: 'Kính gửi quý khách hàng,' + '\n'
                        + `Chúng tôi xin thông báo về trạng thái mới nhất của đơn hàng của Quý khách. \n`
                        + `Mã đơn hàng : ${orderId} \n`
                        + `Giá trị đơn hàng: ${value} \n`
                        + `Trạng thái hiện tại: ${trangthai}`
                        + "\n"
                        + "Chúc quý khách hàng một ngày thật vui vẻ\n"
                        + "Người gửi,\n"
                        + "\t"
                }; //nội dung email
            
                transporter.sendMail(mailOptions,async function(error, info) {
                    if (error) {
                        console.log(error);
                        return "error" + error.message; 
                    } else {
                        console.log('Email sent: ' + info.response);
                        return "Success" + info.response;
                    }
                })
                // In ra giá trị của email và payment_code
                console.log(`Email: ${email}`);

            } else {
                console.log("Không có dữ liệu gửi đến.");
            }
        } 
        else {
            // Token không hợp lệ
            res.status(401).send("Access Token không hợp lệ.");
          }


        // const transporter = nodemailer.createTransport({
        //     service: 'Gmail',
        //     auth: {
        //     user: 'ERP.nhacungcap1@gmail.com', // email của bên gửi
        //     pass: 'mhzoeojbvpimgjvj'
        //     }
        // });

    }
}

module.exports = new emailController();