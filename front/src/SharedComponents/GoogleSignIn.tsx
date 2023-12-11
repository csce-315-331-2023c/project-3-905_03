// // src/components/GoogleSignInButton.tsx
// import React, { useEffect } from 'react';
// import axios from 'axios';

// interface GoogleSignInProps {
//     initUserSession: (accessToken: string, refreshToken: string) => void;
//     handleLoginError: (error: any, errorMessage: string) => void;
// }


// const GoogleSignIn: React.FC<GoogleSignInProps> = ({ initUserSession, handleLoginError }) => {
//     const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

//     useEffect(() => {
//         /* global google */
//         window.google.accounts.id.initialize({
//             client_id: googleClientId,
//             callback: handleGoogleLoginSuccess
//         });

//         window.google.accounts.id.renderButton(
//             document.getElementById('buttonDiv'),
//             { theme: 'outline', size: 'large' }
//         );
//     }, [googleClientId]);

//     const handleGoogleLoginSuccess = async (response: any) => {
//         const idToken = response.credential;
//         try {
//             console.log('Client: Google Login Success, requesting verification from server with token:', idToken);
//             const serverResponse = await axios.post('/auth/google/login', { idToken });
//             if (serverResponse.status === 200) {
//                 console.log('Client: Received data from /auth/google/login', serverResponse.data);
//                 const { accessToken, refreshToken } = serverResponse.data;
//                 initUserSession(accessToken, refreshToken);
//             } else {
//                 handleLoginError(serverResponse.status, 'Google Authentication Failed: Invalid Credentials');
//             }
//         } catch (error) {
//             handleLoginError(error, 'Google Authentication Failed: Invalid Credentials');
//         }
//     };

//     return <div id="buttonDiv" />;
// };

// export default GoogleSignIn;
