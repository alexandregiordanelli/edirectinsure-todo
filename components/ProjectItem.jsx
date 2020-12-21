import { useState } from 'react';
import { useStateValue } from './State';
import { Form } from './Form';
import { TaskItem } from "./TaskItem";

export const ProjectItem = (props) => {
    const [state, dispatch] = useStateValue();
    const [edit, setEdit] = useState(false);

    const remove = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-auth", state.token);

        var urlencoded = new URLSearchParams();
        urlencoded.append("id", props._id);

        fetch("/api/project", {
            method: 'DELETE',
            headers: myHeaders,
            body: urlencoded,
        })
            .then(response => response.json())
            .then(result => {
                fetch("/api/user", {
                    method: 'GET',
                    headers: myHeaders
                })
                    .then(x => x.json())
                    .then(y => {
                        dispatch({ type: "CHANGE_USER", value: y });
                    });
            });
    };

    return (
        <>
            <div className="header">
                {edit ? <Form type="project" {...props} edit={true} cb={() => setEdit(false)} /> : <span>{props.project}</span>}
                {!edit && <div className="flex">
                    <button onClick={() => setEdit(true)}>edit</button>
                    <button onClick={remove}>delete</button>
                </div>}
            </div>
            <style jsx>{`
            .flex {
                display: flex;
            }
            .header {
                background: black;
                display: flex;
                justify-content: space-between;
            }
            span{
                font-size: 14px;
                color: white;
                line-height: 30px;
            }
            ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }  
            button {
                line-height: 30px;
            }
            `}</style>
            <ul>
                <li><Form type="task" projectId={props._id} /></li>
                {state.tasks?.filter(x => x.project == props._id).map((x, i) => <li><TaskItem key={i} {...x} /></li>)}
            </ul>
        </>
    );
};
