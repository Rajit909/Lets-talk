import amqp from "amqplib"
import dotenv from "dotenv"
import nodemailer from "nodemailer"
dotenv.config();
export const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqps",
            hostname: process.env.Rabbitmq_Host,   // fuji.lmq.cloudamqp.com
            port: 5671,
            username: process.env.Rabbitmq_Username,
            password: process.env.Rabbitmq_Password,
            vhost: process.env.Rabbitmq_Vhost,
    })

    const channel = await connection.createChannel();
    const queueName = "send-otp"

    await channel.assertQueue(queueName, { durable: true })
    console.log("✔ Mail service consumer started, listning for otp emails")

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const { to, subject, body } = JSON.parse(msg.content.toString())

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: process.env.USER,
              pass: process.env.PASSWORD,
            }
          })
          await transporter.sendMail({
            from: "LetsTalk",
            to,
            subject,
            text: body
          })

          console.log(`OTP mail sent to ${to}`)
          channel.ack(msg);
        } catch (error) {
          console.log("Failed to sent otp:", error)
        }
      }
    })
  } catch (error) {
    console.log("Failed to start rabbitmq Consumer", error)
  }
}