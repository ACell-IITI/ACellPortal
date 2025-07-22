import bcrypt from "bcrypt";
import { Alumni_db, Admin_db } from "../models/User_model.js";
import { OAuth2Client } from 'google-auth-library';
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const hashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);
    return hashedPassword;
}

export const adminSignUp = async (req, res) => {
    const { email, password } = req.body;
    const hPass = await hashedPassword(password);
    return res.send("X")
}

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const hPass = await hashedPassword(password);
    return res.send("X")
}

export const alumniSignUp = async (req, res) => {
    try {
        const { alumniName, alumniEmail, password } = req.body;
        if (!alumniName || !alumniEmail || !password)
            return res.status(400).json({ error: 'Name, email, and password are required' });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(alumniEmail)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        const insEmailRegex = /^[a-zA-Z0-9._%+-]+@iiti\.ac\.in$/;
        let isInstituteEmail = false;
        if(insEmailRegex.test(alumniEmail)) isInstituteEmail = true;
        const existingUser = await Alumni_db.findOne({alumniEmail});
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        const hPass = await hashedPassword(password);
        const user = await Alumni_db.create({
            alumniName,
            alumniEmail,
            alumniPassword: hPass,
            isInstituteEmail
        });
        const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d',});
        res.cookie('appToken', appToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7* 24 * 60 * 60 * 1000,
        });
        const finalUser = {
            id: user._id,
            alumniName: user.alumniName,
            alumniEmail: user.alumniEmail,
        };
        return res.status(200).json({ finalUser });
    } catch (err) {
        return res.status(500).json({ error: 'Some error occured, sorry' });
    }
}

export const alumniLogin = async (req, res) => {
  try {
    const { alumniEmail, password } = req.body;
    if (!alumniEmail || !password) 
        return res.status(400).json({ error: 'Login credentials are required.' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(alumniEmail)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    const user = await Alumni_db.findOne({ alumniEmail });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if(user.authProvider=='google') return res.status(400).json({
        message: 'This email is registered with google. Use Google Login.',
    });
    const isMatch = await bcrypt.compare(password, user.alumniPassword);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.cookie('appToken', appToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7* 24 * 60 * 60 * 1000,
    });
    const finalUser = {
        id: user._id,
        alumniName: user.alumniName,
        alumniEmail: user.alumniEmail,
    };
    return res.status(200).json({user: finalUser});
  } catch (err) {
    return res.status(500).json({ error: 'Some error occured, sorry' });
  }
};

export const googleAuth = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, hd } = payload;
    let user = await Alumni_db.findOne({ alumniEmail: email });

    if (!user) {
      let isInsEmail = (hd=="iiti.ac.in");
      user = await Alumni_db.create({
        alumniName: name,
        alumniEmail: email,
        alumniProfilePic: picture,
        authProvider: 'google',
        isInstituteEmail: isInsEmail
      });
    }
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.cookie('appToken', appToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7* 24 * 60 * 60 * 1000,
    });
    const finalUser = {
        id: user._id,
        alumniName: user.alumniName,
        alumniEmail: user.alumniEmail,
    };
    return res.status(200).json({ finalUser });
  } catch (err) {
    console.error('Google Auth Error', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};