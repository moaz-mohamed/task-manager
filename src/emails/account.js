import Mailgun from "mailgun.js";
import formData from "form-data";


const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY,
	
});

export const sendWelcomeEmail =  (email, name) => {
	mg.messages.create(process.env.MAILGUN_DOMAIN, {
		from: `Task App <mailgun@${process.env.MAILGUN_DOMAIN}>`,
		to: [`${email}`],
		subject: "Welcome to Task App",
		text: `Welocme to app, ${name}. \n
		You're receiving this email because you recently created a new Task App account or added a new email address. If this wasn't you, please ignore this email.`,
	  })
	  .then(msg => console.log(msg)) // logs response data
	  .catch(err => console.error(err)); // logs any error
}



export const sendCancelationEmail = (email, name) => {
	mg.messages.create(process.env.MAILGUN_DOMAIN, {
		from: `Task App <mailgun@${process.env.MAILGUN_DOMAIN}>`,
		to: [`${email}`],
		subject: "Goodbye from Task App",
		text: `Goodbye from Task App, ${name}. \n
		You’re receiving this email because you recently deleted your Task App account. We would really appreciate your feedback on why you are deleting your account.`,
	  })
	  .then(msg => console.log(msg)) // logs response data
	  .catch(err => console.error(err)); // logs any error
}


