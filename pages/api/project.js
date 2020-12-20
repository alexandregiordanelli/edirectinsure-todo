import nc from 'next-connect';
import database from '../../util/database';
import auth from '../../util/auth'
import {ObjectID} from 'mongodb'

const handler = nc();
handler.use(database);
handler.use(auth);

handler.get(async (req, res) => {
    const project = await req.db.collection('projects').findOne({_id: new ObjectID(req.query.id)})
    if(project.owner == req.userid)
        return res.json(project);
    else
        return res.status(401).send('it is not your project')
})

handler.post(async (req, res) => {
    
    const { ops } = await req.db.collection('projects').insertOne({
        owner: req.userid,
        project: req.body.project
    });

    const project = ops[0]

    const user = await req.db.collection('users').findOne({_id: new ObjectID(req.userid)})
    if(user.projects)
        user.projects.push(project._id)
    else
        user.projects = [project._id]
    await req.db.collection('users').updateOne({_id: new ObjectID(req.userid)}, { $set: user });


    res.json(project);
});

handler.put(async (req, res) => {    
    await req.db.collection('projects').updateOne({_id: new ObjectID(req.body.id)}, { $set: {
        project: req.body.project,
        owner: req.userid,
    }});

    res.json({updated: true});
});

handler.delete(async (req, res) => {    
    await req.db.collection('projects').deleteOne({_id: new ObjectID(req.body.id)});

    const user = await req.db.collection('users').findOne({_id: new ObjectID(req.userid)})
    user.projects = user.projects.filter(x => x != req.body.id)

    await req.db.collection('users').updateOne({_id: new ObjectID(req.userid)},  { $set: user });

    res.json({deleted: true});
});

export default handler
