// const nodemailer = require('nodemailer')

const APP_CONFIG = require('../config/config')


// const transporter = nodemailer.createTransport({
//   service: APP_CONFIG.emailOptions.emailService,
//   auth: {
//     user: APP_CONFIG.emailOptions.emailAccount,
//     pass: APP_CONFIG.emailOptions.emailAccountPassword,
//   }
// })

exports.sendEmail = async data => {
  // try {
  //   let result = await transporter.sendMail({
  //     from: APP_CONFIG.emailOptions.emailAccount,
  //     to: data.to,
  //     subject: data.subject,
  //     html: data.html,
  //   })
  //   return {
  //     data: result,
  //     error: null,
  //   }
  // } catch (err) {
  //   return {
  //     error: err,
  //   }
  // }
}
