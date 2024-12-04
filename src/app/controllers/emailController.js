const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { 
    user: '21522279@gm.uit.edu.vn', // email của bên gửi
    pass: 'pmmm jpxl pvpr yral'
    }
});


class emailController {
    send(req, res) {
        try {
            console.log("Đã vào được API email.");
            
            // Kiểm tra dữ liệu gửi đến có phải là form-data không
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
        } catch (error) {
            console.error("Đã xảy ra lỗi:", error);
        }
        // const transporter = nodemailer.createTransport({
        //     service: 'Gmail',
        //     auth: {
        //     user: 'ERP.nhacungcap1@gmail.com', // email của bên gửi
        //     pass: 'mhzoeojbvpimgjvj'
        //     }
        // });

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

    sendCSKH(req, res) {
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
                + `Cảm ơn bạn đã tin tưởng và sử dụng sản phẩm của chúng tôi, chúng tôi xin chân thành cảm ơn.\n`
                + "Chúng tôi mới ra mắt dòng sản phẩm " + req.body.product_name.toString() + "\n"
                + "Cảm ơn quý khách hàng đã đọc. \n " 
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


    status(req, res) {
        try {
            console.log("Đã vào được API email.");
            
            // Kiểm tra dữ liệu gửi đến có phải là form-data không
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
        } catch (error) {
            console.error("Đã xảy ra lỗi:", error);
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