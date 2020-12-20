import { useEffect } from 'react'
import { StateProvider } from '../components/State'
import Dynamic from '../components/Dynamic'
import { FormEmailPassword } from '../components/FormEmailPassword'

const Signup = () => 
    <Dynamic>
        <FormEmailPassword signup={true}/>
    </Dynamic>

export default Signup