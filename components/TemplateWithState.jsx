import { StateProvider, useStateValue, persistState } from '../components/State'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'


const Template = (props) => {
    const [state, dispatch] = useStateValue();
    const router = useRouter()

    useEffect(()=>{
        if(state.token)
            router.push('/user')
        else if(router.asPath == '/user')
            router.push('/signin')
    }, [state.token])

    useEffect(()=>{
        persistState('edirect', state)
    }, [state])

    useEffect(()=>{
        if(state.user?.projects){
            const p = state.user.projects.map(x => {
                var myHeaders = new Headers();
                myHeaders.append("x-auth", state.token);

                return fetch(`/api/project?id=${x}`, {
                    method: 'GET',
                    headers: myHeaders
                })
                .then(response => response.json())
            })
            Promise.all(p).then(x => {
                dispatch({type: 'SET_PROJECTS', value: x})
            })
        }
    }, [state.user?.projects])

    return props.children
}


const TemplateWithState = (props) => {
    return (
        <StateProvider>
            <Template>
                {props.children}
            </Template>
        </StateProvider>
    )
}

export default TemplateWithState