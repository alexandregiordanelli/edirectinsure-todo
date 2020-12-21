import { useEffect, useState } from 'react'
import { StateProvider, useStateValue } from '../components/State'
import Dynamic from '../components/Dynamic'
import { FormEmailPassword } from '../components/FormEmailPassword'

const Form = (props) => {
    const [state, dispatch] = useStateValue()
    const [name, setName] = useState(props[props.type]? props[props.type]: '')

    const create = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-auth", state.token);

        var urlencoded = new URLSearchParams();
        urlencoded.append(props.type, name);
        if(props.type == "task"){
            urlencoded.append("projectId", props.project || props.projectId);
        }


        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded
        };

        if(props.edit){
            urlencoded.append("id", props._id);
            requestOptions.method = 'PUT'
        }

        fetch("api/"+props.type, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(props.cb) props.cb()
            fetch("/api/user", {
                method: 'GET',
                headers: myHeaders
              })
              .then(response => response.json())
              .then(result => {
                  dispatch({type: "CHANGE_USER", value: result})
              })
        })
        .catch(error => console.log('error', error));


    }

    return (
        <>
            <div>
                <input type="text" value={name} placeholder={props.type + ' name'} onChange={e => setName(e.target.value)}/>
                <button onClick={create}>{props.edit? 'update': 'create ' + props.type}</button>
                {props.edit && <button onClick={()=>props.cb()}>cancel</button>}
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
    )
}

const ProjectItem = (props) => {
    const [state, dispatch] = useStateValue()
    const [edit, setEdit] = useState(false)

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
                  dispatch({type: "CHANGE_USER", value: y})
              })
        })
    }

    return (
        <>
            <div className="header">
                {edit? <Form type="project" {...props} edit={true} cb={() => setEdit(false)}/>: <span>{props.project}</span>} 
                {!edit && <div className="flex">
                    <button onClick={()=>setEdit(true)}>edit</button>
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
                <li><Form type="task" projectId={props._id}/></li>
                {state.tasks?.filter(x => x.project == props._id).map((x, i) => <li><TaskItem key={i} {...x} /></li>)}
            </ul>
        </>
    )
}

    const TaskItem = (props) => {
        const [state, dispatch] = useStateValue()
        const [edit, setEdit] = useState(false)
        const [checked, setChecked] = useState(false)
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
                      console.log(y)
                      dispatch({type: "CHANGE_USER", value: y})
                  })
            })
        }



    return (
        <>
            <div className="header">
                {!edit && <input id={props._id} disabled={checked} type="checkbox" checked={checked} onChange={e=> setChecked(e.target.checked)}/>}
                {edit? <Form type="task" {...props} edit={true} cb={() => setEdit(false)}/>: <label htmlFor={props._id}>{props.task}</label>} 
                {!edit && !checked && <div className="flex">
                    <button onClick={()=>setEdit(true)}>edit</button>
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
        
    )
}

const Header = props => 
    <>
    <div className="header">
        <h1>{props.email}</h1>
        <button onClick={()=>{
            props.dispatch({type: 'CLEAR_TOKEN'})
            props.dispatch({type: 'CHANGE_USER', value: null})
        }}>sign out</button>
    </div>
    <style jsx>{`
    .header {
        background: black;
        display: flex;
        justify-content: space-between;
    }    
    h1 {
        margin: 0;
        color: white;
    }
    button {
        line-height: 30px;
    }
    `}</style>
    </>

const Projects = props =>
<>
    <ul className="flex-container">
        <li className="flex-item"><Form type="project"/></li>
        {props.projects?.map((x, i) => <li className="flex-item"><ProjectItem key={i} {...x}/></li>)}
    </ul>
    <style jsx>{`
    .flex-container {
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
    }    
    .flex-item{
        background: tomato;
        width: calc(33% - 18px);
        margin: 10px;
        color: white;
    }
    `}</style>
</>

const UserPage = () => {
    const [state, dispatch] = useStateValue();

    if(state.user){
        return (
            <>
                <style jsx global>{`
                    *{
                        font-size: 14px;
                        line-height: 30px;
                        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto, Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue, sans-serif;
                    }
               body{
                   margin: 0;
                   padding: 0;
               }
                `}</style>
                <Header dispatch={dispatch} email={state.user.email}/>
                
                <Projects projects={state.projects}/>
                

            </>
        )
    } return null
}

const User = () =>         
    <Dynamic>
        <UserPage/>
    </Dynamic>

export default User