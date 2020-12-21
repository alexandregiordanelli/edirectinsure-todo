import { useEffect, useState } from 'react'
import { StateProvider, useStateValue } from '../components/State'
import Dynamic from '../components/Dynamic'
import { FormEmailPassword } from '../components/FormEmailPassword'

const FormProject = (props) => {
    const [state, dispatch] = useStateValue()
    const [name, setName] = useState(props.project? props.project: '')

    const createProject = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-auth", state.token);

        var urlencoded = new URLSearchParams();
        urlencoded.append("project", name);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded
        };

        if(props.edit){
            urlencoded.append("id", props._id);
            requestOptions.method = 'PUT'
        }

        fetch("api/project", requestOptions)
        .then(response => response.json())
        .then(result => {
            if(props.cb) props.cb()
            fetch("/api/user", {
                method: 'GET',
                headers: myHeaders
              })
              .then(response => response.json())
              .then(result => {
                  console.log(result)
                  dispatch({type: "CHANGE_USER", value: result})
              })
        })
        .catch(error => console.log('error', error));


    }

    return (
        <>
            <input type="text" value={name} onChange={e => setName(e.target.value)}/>
            <button onClick={createProject}>Create Project</button>
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
                  console.log(y)
                  dispatch({type: "CHANGE_USER", value: y})
              })
        })
    }


    if(edit)
        return <FormProject {...props} edit={true} cb={() => setEdit(false)}/>
    return (
        <li>{props.project} 
            <button onClick={()=>setEdit(true)}>edit</button>
            <button onClick={remove}>delete</button>
            <ul>
                {state.tasks?.filter(x => props._id == x.project).map(x => {
                    return <li>{JSON.stringify(x)}</li>
                })}
            </ul>
        </li>
    )
}

const UserPage = () => {
    const [state, dispatch] = useStateValue();

    if(state.user){
        return (
            <>
                <h1>
                    {state.user.email}
                </h1>

                <button onClick={()=>{
                    dispatch({type: 'CLEAR_TOKEN'})
                    dispatch({type: 'CHANGE_USER', value: null})
                }}>sign out</button>
                
                <FormProject/>

                <ul>
                    {state.projects?.map((x, i) => <ProjectItem key={i} {...x}/>)}
                </ul>

            </>
        )
    } return null
}

const User = () =>         
    <Dynamic>
        <UserPage/>
    </Dynamic>

export default User