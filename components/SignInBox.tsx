import * as React from 'react'

import { api } from '../lib/config'
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router'

const SignInBox = () => {
    const [ isLoading, setLoading ] = React.useState<boolean>(false);
    const [ gotError, setError ] = React.useState<string>();
    const [cookies, setCookie, removeCookie] = useCookies(['dyke-registered']);
    const router = useRouter()


    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (isLoading) return
        setLoading(true)
        const formData = new FormData(event.currentTarget);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const userMail: string = formData.get("email");
        if (!userMail){
            setLoading(false)
        }
        fetch(api.validateRegistered + '?email=' + userMail, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if(data.registered){
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    setCookie('dyke-registered', data.registered)
                    setError(null)
                }else {
                    setError("Not registered yet")
                }
            }).then(()=>{
                setLoading(false)
            })
    };    

    if(cookies['dyke-registered']){
        return (
            <button onClick={() => removeCookie("dyke-registered")}>Logout</button>
        )
    }

    return  (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "calc(100vh - 20px)" }}>
            <div style={{ background: "var(--white)", padding: 50 }}>
                <h1>Dykeathon personal area - sign in</h1>
                {isLoading && "loading"}
                {gotError && gotError}
                {!isLoading &&
                    <form onSubmit={onSubmit} id="email-form">
                        <input type="email" placeholder="Email" name='email' id='email'/>
                        <button type='submit' formTarget='email-form' name='submit'>Submit</button>
                    </form>
                }
                <br />
                <button onClick={() => router.push("/main-registration")}>Let me register first</button>
            </div>
        </div>
    )
}


export default SignInBox;