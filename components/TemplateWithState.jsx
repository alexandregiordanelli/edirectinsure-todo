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

    return (
        <>
            {props.children}
        </>
    )
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