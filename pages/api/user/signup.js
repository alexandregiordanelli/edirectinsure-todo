import Status from 'http-status-codes'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import nc from 'next-connect';
import database from '../../../util/database';

const handler = nc();
handler.use(database)

handler.post(async (req, res) => {
    try {
        let { email, password } = req.body;

        // validate

        if (!email || !password)
            return res.status(Status.BAD_REQUEST).json({ msg: "Not all fields have been entered." });
        if (password.length < 5)
            return res
                .status(400)
                .json({ msg: "The password needs to be at least 5 characters long." });

        const existingUser = await req.db.collection('users').findOne({ email })
        if (existingUser)
            return res
                .status(Status.BAD_REQUEST)
                .json({ msg: "An account with this email already exists." });


        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const { ops } = await req.db.collection('users').insertOne({
            email,
            password: passwordHash
        });

        const newUser = ops[0]

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.setHeader('x-auth', token)
        res.status(Status.CREATED).json({
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
            },
        });
    } catch (err) {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
})

export default handler