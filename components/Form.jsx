import { useState } from 'react';
import { useStateValue } from './State';
export const Form = (props) => {
    const [state, dispatch] = useStateValue();
    const [name, setName] = useState(props[props.type] ? props[props.type] : '');

    const create = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-auth", state.token);

        var urlencoded = new URLSearchParams();
        urlencoded.append(props.type, name);
        if (props.type == "task") {
            urlencoded.append("projectId", props.project || props.projectId);
        }


        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded
        };

        if (props.edit) {
            urlencoded.append("id", props._id);
            requestOptions.method = 'PUT';
        }

        fetch("api/" + props.type, requestOptions)
            .then(response => response.json())
            .then(result => {
                setName('')
                if (props.cb)
                    props.cb();
                fetch("/api/user", {
                    method: 'GET',
                    headers: myHeaders
                })
                    .then(response => response.json())
                    .then(result => {
                        dispatch({ type: "CHANGE_USER", value: result });
                    });
            })
            .catch(error => console.log('error', error));


    };

    return (
        <>
            <div>
                <input type="text" value={name} placeholder={props.type + ' name'} onChange={e => setName(e.target.value)} />
                <button onClick={create}>{props.edit ? 'update' : 'create ' + props.type}</button>
                {props.edit && <button onClick={() => props.cb()}>cancel</button>}
            </div>
            <style jsx>{`
            div{
                display: flex;
                flex: 1;
            }
            button{
                flex: 1;
            }
            input {
                flex: 3;
            }
            `}</style>
        </>
    );
};
