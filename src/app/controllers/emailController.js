const nodemailer = require('nodemailer');

class emailController {
    send(req, res) {
        const email = req.body.email;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: 'ERP.nhacungcap1@gmail.com', // email của bên gửi
            pass: 'mhzoeojbvpimgjvj'
            }
        });
    
        const mailOptions = {
            from: 'ERP.nhacungcap1@gmail.com', // đại chỉ bên gửi
            to: email ,// địa chỉ bên nhận
            subject: 'Xác nhận quy trình',
            text: 'Kính gửi giám đốc ' + '\n'
                + "Tôi là Tú, đến từ bộ phận phối trộn xăng dầu \n"
                + "Chúng tôi sắp tiến hành phối trộn xăng " + " với quy trình như sau: \n"
                + "\n"
                + "Chúng tôi hi vọng xác nhận sớm của giám đốc. \n"
                + "Cảm ơn giám đốc đã xem. \n"
                + "Người gửi,\n"
                + "\tTu"
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
}

module.exports = new emailController();