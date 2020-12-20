import { useEffect } from 'react'
import { StateProvider } from '../components/State'
import Dynamic from '../components/Dynamic'
import { FormEmailPassword } from '../components/FormEmailPassword'

const Signin = () => 
    <Dynamic>
        <FormEmailPassword signup={false}/>
    </Dynamic>

export default Signin