import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Login.css';
const managers: { [key: string]: number } = {
  'Revanth': 1,
  'Ryan': 2
};

const cashiers: { [key: string]: number } = {
  'Sam': 3,
  'Kotda': 4,

};

function LoginPage() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: '769749977691-dlmncdn47522pj0g3vgn46f5vtjd2jap.apps.googleusercontent.com',
      });
    });
  }, []);

  const handleGoogleLogin = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser) => {
      // You can get the Google user info here if you need it
      const profile = googleUser.getBasicProfile();
      console.log('Name: ' + profile.getName());

      // Here you would send the ID token to your server for verification
      const id_token = googleUser.getAuthResponse().id_token;
      console.log('ID Token: ' + id_token);

      // Navigate to Manager GUI for demonstration; in a real app, you'd validate the token server-side
      navigate('/manager');
    });
  };

  const handleSubmit = () => {
    const parsedId = parseInt(id, 10);
    if (managers[name] === parsedId) {
      navigate('/manager');
    } else if (cashiers[name] === parsedId) {
      navigate('/cashier');
    } else {
      console.log('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        className="login-input"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="login-input"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button className="login-button" onClick={handleSubmit}>
        Submit
      </button>
      <button className="google-button" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}

export default LoginPage;
