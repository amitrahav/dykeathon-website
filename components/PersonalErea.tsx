import * as React from 'react'
import { useCookies } from 'react-cookie'
import { api } from '../lib/config';
import SignInBox from './SignInBox';
import { Loading } from './Loading';

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
        return <Loading />
    }
    if(userData){
    const userName = userData["Name"]["title"][0]["plain_text"];
    const arrivalResponse = (userData["Arrival response"]["multi_select"] || []).map(sel => sel?.name)
    const projects = userData["Voted"]["relation"];
    const userEmail = userData["Email"]["email"];
    
    // You can find the form ID in the URL of this page
    // https://tally.so/forms/wQ1bLl/share
    const formIdProjects = 'wQ1bLl';
    const formIdApproval = 'n9BkrY';
    
    const tallyOptions = {
        onClose: () =>{
            const popups = document.body.getElementsByClassName('tally-popup');
            if(!popups.length){
                document.body.classList.remove('space-for-tally')            
            }
        },
    }
    
    if(!projects.length){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Tally.openPopup(formIdProjects, {...tallyOptions, hiddenFields: {
         "self_email": userEmail
        }} );
        document.body.classList.add('space-for-tally')
    }

    // Open the popup
    if(!arrivalResponse.length){
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Tally.openPopup(formIdApproval, tallyOptions);    
        document.body.classList.add('space-for-tally')
    }

    return (<>
        <div style={{background: "#fff", marginBottom: 10, padding: "10px 30px"}}>
            <p>
                Hello {userName}! <br/>
                This is your perssonal erea (: <br/>
                Your Arrival response: {arrivalResponse}
            </p>

            <b>Choose any of the projects below that you want to join, we will try our best to assign you on one of those projects (Pls choose more than 1)</b>
            <br/>
            <p>Your selected projects: {projects}</p>
            <SignInBox />
        </div>
    </>)
    }
}

export default PersonalErea;