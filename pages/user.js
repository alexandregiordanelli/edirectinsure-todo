import { useEffect } from 'react'
import { StateProvider, useStateValue } from '../components/State'
import Dynamic from '../components/Dynamic'
import { FormEmailPassword } from '../components/FormEmailPassword'

const UserPage = () => {
    const [state, dispatch] = useStateValue();

    console.log('userpage', state)

    if(state.user){
        return (
            <>
                <h1>
                    {state.user.email}
                </h1>
                <button onClick={()=>dispatch({type: 'CLEAR_TOKEN'})}>sign out</button>
            </>
        )
    } return null
}

const User = () => {
    return (
        <Dynamic>
            <UserPage/>
        </Dynamic>
    )
}

export default User