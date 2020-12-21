import { useState } from 'react';
import { useStateValue } from './State';
import { Form } from './Form';
export const TaskItem = (props) => {
    const [state, dispatch] = useStateValue();
    const [edit, setEdit] = useState(false);
    const [checked, setChecked] = useState(false);
    const remove = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-auth", state.token);

        var urlencoded = new URLSearchParams();
        urlencoded.append("id", props._id);
        urlencoded.append("projectId", props.project);

        fetch("/api/task", {
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
                        console.log(y);
                        dispatch({ type: "CHANGE_USER", value: y });
                    });
            });
    };



    return (
        <>
            <div className="header">
                {!edit && <input id={props._id} disabled={checked} type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />}
                {edit ? <Form type="task" {...props} edit={true} cb={() => setEdit(false)} /> : <label htmlFor={props._id}>{props.task}</label>}
                {!edit && !checked && <div className="flex">
                    <button onClick={() => setEdit(true)}>edit</button>
                    <button onClick={remove}>delete</button>
                </div>}
            </div>
            <style jsx>{`
            .flex {
                display: flex;
            }
            .header {
                display: flex;
                justify-content: space-between;
            }
            label{
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
        </>

    );
};
