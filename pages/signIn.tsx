import * as React from 'react'
import { api } from '../lib/config'

const SignInBox = () => {
    const [ isLoading, setLoading ] = React.useState<boolean>(false);
    const [ isRegistered ,setRegistered ] = React.useState<boolean>(false);

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (isLoading || isRegistered) return
        setLoading(true)
        const formData = new FormData(event.currentTarget);
        fetch(api.validateRegistered + '?email=' + formData.get("email"), {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log({data})
                setRegistered(data.registered)
                setLoading(false)
            })
    };    

    return !isRegistered? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "calc(100vh - 20px)" }}>
            <div style={{ background: "var(--white)", padding: 50 }}>
                <h1>Dykeathon personal area - sign in</h1>
                {isLoading? "loading": 
                    <form onSubmit={onSubmit} id="email-form">
                        <input type="email" placeholder="Email" name='email' id='email'/>
                        <button type='submit' formTarget='email-form' name='submit'>Submit</button>
                    </form>
                }
                <button>Let me register first</button>
            </div>
        </div>
    ): (
        <></>
    )
}


export default SignInBox;
