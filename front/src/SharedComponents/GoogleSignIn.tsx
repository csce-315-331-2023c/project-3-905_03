
import React, { useEffect } from 'react';

const GoogleSignIn = () => {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    const handleCallbackResponse = (response: any) => {
        console.log("Encoded JWT ID token: " + response.credential);
        
    };

    useEffect(() => {
        window.gapi.load('auth2', () => {
            const auth2 = window.gapi.auth2.init({ client_id: googleClientId });
            auth2.attachClickHandler(
                document.getElementById('signInButton'),
                {},
                handleCallbackResponse,
                (error: any) => console.error('Error attaching click handler:', error)
            );
        });
    }, [googleClientId]);

    return <button id="signInButton">Sign in with Google</button>;
};

export default GoogleSignIn;
