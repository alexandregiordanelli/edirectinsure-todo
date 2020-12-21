import { StateProvider, useStateValue, persistState } from '../components/State'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'


const Template = (props) => {
    const [state, dispatch] = useStateValue();
    const router = useRouter()

    useEffect(()=>{
        console.log("passou aqui")
        if(state.token)
            router.push('/')
        else if(router.asPath == '/')
            router.push('/signin')
    }, [state.token])

    useEffect(()=>{
        persistState('edirect', state)
    }, [state])

    useEffect(()=>{
        if(state.user?.projects){
            var myHeaders = new Headers();
            myHeaders.append("x-auth", state.token);

            const p = state.user.projects.map(x => {
                return fetch(`/api/project?id=${x}`, {
                    method: 'GET',
                    headers: myHeaders
                })
                .then(response => response.json())
            })
            Promise.all(p).then(x => {
                dispatch({type: 'SET_PROJECTS', value: x})
                const t = []
                x.forEach(y => {
                    const tasks = y.tasks?.map(z => {
                        return fetch(`/api/task?id=${z}`, {
                            method: 'GET',
                            headers: myHeaders
                        }).then(response => response.json())
                    })
                    if(tasks)
                        t.push(...tasks)
                })
                Promise.all(t).then(x => {
                    dispatch({type: 'SET_TASKS', value: x})
                })
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