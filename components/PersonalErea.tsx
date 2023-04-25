import * as React from 'react'
import { useCookies } from 'react-cookie'
import { api } from '../lib/config';

const PersonalErea = () => {
    const [cookies] = useCookies(['dyke-registered']);
    const [ gotError, setError ] = React.useState<string>();
    const [userData , setUserData] = React.useState<Record<string, string>>();
    const [loading , setLoading] = React.useState<boolean>(false);
    const userId = cookies['dyke-registered'];
    
    React.useEffect(()=> {
        if(!userData && !!userId){
            setLoading(true)
            fetch(api.userData + '?id=' + userId, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    if(data){
                        setUserData(data)
                    } else {
                        setError("Not registered yet")
                    }
                }).then(()=>{
                    setLoading(false)
                })
        }
        
    }, [userData, userId])

    if (!cookies['dyke-registered']) {
        return <p>Please sign up for a Dyke account</p>
    }
    if (gotError){
        return <p> {gotError} </p>
    }

    if(loading) {
        return <p> {loading} </p>
    }
    if(userData){
    const userName = userData["Name"]["title"][0]["plain_text"];
    const arrivalResponse = userData["Arrival response"]["multi_select"].map(sel => sel.name)
    // const teamMembers = userData["team members"]["rich_text"];
    const projects = userData["Voted"]["relation"];
    // const formFields = {
    //     arrivalResponse:{
    //         type: "multi",
    //         value: arrivalResponse
    //     },
    //     teamMembers: {
    //         type: "texteare",
    //         value: teamMembers
    //     },
    //     projects: {
    //         type: "multi",
    //         value: projects
    //     }

    // }
    return (
    <div style={{background: "#fff", marginBottom: 10, padding: "10px 30px"}}>
        <p>
            Hello {userName}! <br/>
            This is your perssonal erea (: <br/>
            Your Arrival response: {arrivalResponse}
        </p>

        <b>Choose any of the projects below that you want to join, we will try our best to assign you on one of those projects (Pls choose more than 1)</b>
        <br/>
        <p>Your selected projects: {projects}</p>

        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdWmZ1QfI3hho8af8_9Bmq8Se8EJWi30RQjo6pqKAS_1m6Ajw/viewform?embedded=true" width="100%" height="auto" frameborder="0" marginheight="0" marginwidth="0">Loading form</iframe>
        
    </div>)
    }

}

export default PersonalErea;