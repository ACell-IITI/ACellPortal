import bcrypt from "bcrypt";

export const hashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);
    return hashedPassword;
}

export const alumniSignUp = async (req, res) => {
    const { email, password } = req.body;
    const hPass = await hashedPassword(password);
    return res.send("X")
}

export const alumniLogin = async (req, res) => {
    const { email, password } = req.body;
    const hPass = await hashedPassword(password);
    return res.send("X")
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