import nc from 'next-connect';
import database from '../../util/database';
import auth from '../../util/auth'
import {ObjectID} from 'mongodb'

const handler = nc();
handler.use(database);
handler.use(auth);
handler.get(async (req, res) => {
    const task = await req.db.collection('tasks').findOne({_id: new ObjectID(req.query.id)})
    return res.json(task);
})
handler.post(async (req, res) => {
    
    const { ops } = await req.db.collection('tasks').insertOne({
        owner: req.userid,
        project: req.body.projectId,
        task: req.body.task
    });

    const task = ops[0]

    const project = await req.db.collection('projects').findOne({_id: new ObjectID(req.body.projectId)})
    if(project.tasks)
        project.tasks.push(task._id)
    else
        project.tasks = [task._id]
    await req.db.collection('projects').updateOne({_id: new ObjectID(req.body.projectId)}, { $set: project });

    res.json(project);
});

handler.put(async (req, res) => {    
    await req.db.collection('tasks').updateOne({_id: new ObjectID(req.body.id)}, { $set: {
        owner: req.userid,
        project: req.body.projectId,
        task: req.body.task,
    }});

    res.json({updated: true});
});

handler.delete(async (req, res) => {    
    await req.db.collection('tasks').deleteOne({_id: new ObjectID(req.body.id)});

    const project = await req.db.collection('projects').findOne({_id: new ObjectID(req.body.projectId)})
    project.tasks = project.tasks.filter(x => x == req.body.id)

    await req.db.collection('projects').updateOne({_id: new ObjectID(req.body.projectId)},  { $set: project });

    res.json({deleted: true});
});

export default handler
