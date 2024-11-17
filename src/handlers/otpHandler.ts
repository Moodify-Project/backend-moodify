import { Request, Response } from 'express';
import { OTP } from '../entity/otpEntity';
import nodemailer from 'nodemailer';
import { redisClient } from '../configs/redis';

export const sendOtpToEmail = async (req: Request, res: Response) => {
    const client = await redisClient();

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            status: false,
            error: 'Please input your email',
        });
    }

    const otp = new OTP();

    const sixDigitOtp = otp.getNewOtp(6, 120);

    // create transporter

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_NODEMAILER || "tachibanahinata2021@gmail.com",
          pass: process.env.PASSWORD_NODEMAILER || "wzoe wpbi pdwo nvxq",
        },
      });

    const email_subject = 'email_subject';
    const email_message = 'email-msg';

    const mailOptions = {
        from: `${process.env.EMAIL_ADDRESS}` || 'tachibanahinata2021@gmail.com',
        to: `${email}`,
        subject: email_subject,
        text: email_message,
    };
  

    transporter.sendMail(mailOptions, async (error, response) => {
        if (error) {
            return res.status(400).json({
                status: false,
                message: error,
            })
        } else {

            await client.set(email, sixDigitOtp);

            return res.status(200).send({
                status: true,
                message: sixDigitOtp 
            });
        }
    })
}

// export const verifyOtp = async (req: Request, res: Response) => {
//     const client = await redisClient();

//     const value = await client.get(email);

//     const { otpBody } = req.body;

//     if (otpBody !== value)
// }