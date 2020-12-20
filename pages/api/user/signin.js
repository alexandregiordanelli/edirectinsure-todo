import Status from 'http-status-codes'
import jwt from "jsonwebtoken";
import nc from 'next-connect';
import database from '../../../util/database';
import bcrypt from 'bcrypt'

const handler = nc();
handler.use(database)

handler.post(async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate
        if (!email || !password)
            return res.status(Status.BAD_REQUEST).json({ msg: "Not all fields have been entered." });

        const user = await req.db.collection('users').findOne({ email })
        if (!user)
            return res
                .status(Status.BAD_REQUEST)
                .json({ msg: "No account with this email has been registered." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(Status.BAD_REQUEST).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.setHeader('x-auth', token)
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
})

export default handler;