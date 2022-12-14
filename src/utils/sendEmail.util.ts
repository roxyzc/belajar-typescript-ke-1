import nodemailer from 'nodemailer';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';

export const verifyEmail = async (req: Request, res: Response, next: NextFunction, user: any) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: ` "Verify your email" <${process.env.USER}>`,
        to: user.data.email,
        subject: 'roxyzc -Verify your email',
        html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #F7F9FA; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: #33aff2;">Welcome to the Blog me .</h2>
            <h3><span style="font-weight:bold; color: red; font-size:1.4rem"> ${user.data.username}</span> ! Thanks for registering in our site </h3>
                    <h4> Just click the button below to validate your email address. </h4>
                    <a style="background: #5a8cdb; border-radius:10px; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;" target="_blank" href="http://${req.headers.host}/api/register/${user.token}">Verify your email</a>
                    </div>
                    `
    };

    transporter
        .sendMail(mailOptions)
        .then((_result) => {
            return res.status(200).json({ status: true, message: 'account created successfully' });
        })
        .catch(async (error) => {
            await User.findByIdAndDelete(user._id);
            return next(error);
        });
};
