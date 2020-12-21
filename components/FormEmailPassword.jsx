import { useState } from 'react';
import { useStateValue } from './State';
import Link from 'next/link'
export const FormEmailPassword = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [state, dispatch] = useStateValue();

    const route = props.signup ? 'signup' : 'signin'
    const otherRoute = !props.signup ? 'signup' : 'signin'

    const submit = e => {
        e.preventDefault();
        var urlencoded = new URLSearchParams();
        urlencoded.append("email", email);
        urlencoded.append("password", password);

        var requestOptions = {
            method: 'POST',
            body: urlencoded
        };

        fetch(`/api/user/${route}`, requestOptions)
            .then(async (response) => {
                const json = await response.json();
                if (response.ok)
                    return json;
                throw json.msg;
            })
            .then(result => {
                dispatch({ type: "SET_TOKEN", value: result.token });
                dispatch({ type: "CHANGE_USER", value: result.user });
            })
            .catch(error => {
                setErrMsg(error);
            });
    };

    return (
        <>
            <h1>{route}</h1>
            <form onSubmit={submit}>
                <input type="text" placeholder="email" onChange={e => setEmail(e.target.value)} value={email} />
                <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} value={password} />
                <input type="submit" value={route} />
                {errMsg && <p>{errMsg}</p>}
            </form>
            <Link href={`/${otherRoute}`}><a>Or click here if you want to {otherRoute}</a></Link>
            <style jsx>{`
            
            `}</style>
        </>
    );
};
