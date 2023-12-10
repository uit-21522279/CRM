const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
    user: 'ERP.nhacungcap1@gmail.com', // email của bên gửi
    pass: 'mhzoeojbvpimgjvj'
    }
});


class emailController {
    send(req, res) {
        const email = req.body.email;
        // const transporter = nodemailer.createTransport({
        //     service: 'Gmail',
        //     auth: {
        //     user: 'ERP.nhacungcap1@gmail.com', // email của bên gửi
        //     pass: 'mhzoeojbvpimgjvj'
        //     }
        // });
    
        const mailOptions = {
            from: 'ERP.nhacungcap1@gmail.com', // đại chỉ bên gửi
            to: email ,// địa chỉ bên nhận
            subject: 'Thư cảm ơn',
            text: 'Kính gửi quý khách hàng,' + '\n'
                + `Tôi là ${req.body.employee} đến từ công ty HL store  \n`
                + "Đơn hàng sản phẩm " + req.body.product_name + " đã được hoàn thành"
                + "Chúng tôi cảm ơn quý khách vì đã yêu quý và ủng hộ chúng tôi "
                + "\n"
                + "Chúc quý khách hàng một ngày thật vui vẻ\n"
                + "Người gửi,\n"
                + "\t" + req.body.employee
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
    }

    async sendBill(req, res) {        
        const compile = async (data) => {
            const filePath = path.join(process.cwd(), './src/template', `index.hbs`);
            const html = await fs.readFile(filePath, 'utf8');
            const template = hbs.compile(html);
            return template(data);
        };
        
        hbs.registerHelper('dateFormat', (value, format) => {
            return moment(value).format(format);
        });
        try {
            const data = 
            {
                invoice_code: req.body.invoice_code,
                created_at: req.body.created_at,
                employee: req.body.employee,
                employee_email: req.body.employee_email,
                product_name: req.body.product_name,
                quantity: req.body.quantity,
                product_price: req.body.product_price,
                total_price: req.body.total_price,
            };
            const browser = await puppeteer.launch({
                executablePath: '/usr/bin/chromium-browser',
                headless:true,
                args: ["--no-sandbox"]
              });
            const page = await browser.newPage();
        
            const content = await compile(data);
        
            await page.setContent(content);
            await page.emulateMediaType('screen');
            await page.pdf({
                path: 'invoice.pdf',
                format: 'A4',
                printBackground: true
            });
        
            console.log('Hoàn thành');
            await browser.close();
            const email = req.body.email;
            const mailOptions = {
                from: 'ERP.nhacungcap1@gmail.com', // đại chỉ bên gửi
                to: email ,// địa chỉ bên nhận
                subject: 'Xác nhận quy trình',
                text: 'Kính gửi quý khách hàng,' + '\n'
                    + `Tôi là ${req.body.employee}, đến từ công ty HL store \n`
                    + "Chúng tôi cảm ơn ông vì đã quan tâm và ủng hộ sản phẩm của chúng tôi " + "\n"
                    + "\n"
                    + "Chúng tôi xin gửi ông hóa đơn của đơn hàng này. \n"
                    + "Cảm ơn quý khách đã đọc đã xem. \n"
                    + "Người gửi,\n"
                    + `\t${req.body.employee}`,
                attachments: [{
                    filename: 'invoice.pdf',
                    path: './invoice.pdf',
                    contentType: 'application/pdf'
                    }],
            }; //nội dung email
        
            transporter.sendMail(mailOptions,async function(error, info) {
                if (error) {
                    console.log(error);
                    return "error" + error.message; 
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.json('success')
                }
            })
            
        } catch (error) {
            console.log('Gặp lỗi:', error);
        }
        
    }
}

module.exports = new emailController();