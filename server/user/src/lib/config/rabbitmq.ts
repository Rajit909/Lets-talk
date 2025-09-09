import amqp from 'amqplib'
import dotenv from 'dotenv';
dotenv.config();

let channel: amqp.Channel;

console.log(process.env.Rabbitmq_Host)

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqps",
            hostname: process.env.Rabbitmq_Host,   // fuji.lmq.cloudamqp.com
            port: 5671,
            username: process.env.Rabbitmq_Username,
            password: process.env.Rabbitmq_Password,
            vhost: process.env.Rabbitmq_Vhost,
        })

        channel = await connection.createChannel();
        console.log("✔ Connected to RabbitMq Successfully")
    } catch (error) {
        console.log("Failed to connect to rabbitMq: ", error)
    }
}


export const publishToQue = async (queueName: string, message: any) => {
    if (!channel) {
        console.log("Rabbit channel is not initialiazed");
        return;
    }

    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true
    })
}