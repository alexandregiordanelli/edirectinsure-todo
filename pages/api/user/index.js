import nextConnect from 'next-connect';
import database from '../../../util/database';
import auth from '../../../util/auth';
import {ObjectID} from 'mongodb'

const handler = nextConnect();
handler.use(database);
handler.use(auth);
handler.get(async (req, res) => {
    const user = await req.db.collection('users').findOne({_id: new ObjectID(req.userid)})
    res.json(user);
});
export default handler;