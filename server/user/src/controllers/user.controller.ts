import express from 'express'
import { User } from '../model/User.model.js'
import TryCatch from '../lib/config/AsyncHandler.js'
import redisClient from '../lib/config/redisdb.js';
import { publishToQue } from '../lib/config/rabbitmq.js';

export const loginUser = TryCatch(async(req, res)=>{
    const { email } = req.body;

    const rateLimitKey = `otp:ratelimit:${email}`;
    
    const rateLimit = await redisClient.get(rateLimitKey);
    if(rateLimit){
        res.status(429).json({
            message: "Too many requests. Please wait before requesting mew otp. "
        });
    }

    const otp = Math.floor(100000 * Math.random() * 900000).toString();

    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, {
        EX: 300
    });

    await redisClient.set(rateLimitKey, "true", {
        EX: 60
    });

    const message = {
        to: email,
        subject: "Your otp code",
        body: `Your OTP is ${otp}.It is valid for 5 Minutes`
    };

    await publishToQue("send-otp", message);

    res.status(200).json({
        message: "Otp sent to your email."
    })
})


export const verifyUser = TryCatch(async(req, res) => {
    const { email, otp: enteredOtp} = req.body;

    if(!email  || enteredOtp){
        res.status(400).json({
            message: "Email and Otp Required!"
        });
        return;
    }

    const otpKey = `otp:${email}`

    const storedOtp = await redisClient.get(otpKey)

    if(!storedOtp  || storedOtp !== enteredOtp ) {
        res.status(400).json({
            message: "Invalid OTP"
        });
        return;
    }

    await redisClient.del(otpKey);

    let user = await User.findOne({email})
   
    if(!user){
        const name = email.slice(0, 8);
        user = await User.create({name, email});
    }

    // const token
}) 