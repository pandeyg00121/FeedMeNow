const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: "pranaypandey00121@gmail.com",
    pass: "wavrhadgpqsmgfue",
  },
});

// send mail with defined transport object
const mailOptions ={
    from: "pranaypandey00121@gmail.com",
    to: "pypy1401@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    html: "<b>Hello world?</b>", // html body
};

const sendMail = async() =>{
    try {
        const details = {
            from: "pranaypandey00121@gmail.com",
            to: "", // list of receivers
            subject: "Oyeee mail ja rhi haiii", // Subject line
            html: "<b>Hello world?</b>"
        };
        transporter.sendMail(details, (err, info) => {
            if (err) {
                console.log("error occured in sending mail", err);
            } else {
                console.log("mail sent", info);
            }
        });
    } catch (error) {
        console.log("unable to send mail", error);
    }
}


