import React from 'react'
import GoogleButton from 'react-google-button'
import 'bootstrap/dist/css/bootstrap.min.css'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

type Props = {
  setIsAuth: (isAuth: boolean) => void;
}

export default function Login({ setIsAuth }: Props) {

  let navigate = useNavigate();

  const signInWithGoogle = (): void => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", "true");
      setIsAuth(true);
      navigate("/");
    }).catch((err) => { console.log("Error during Google Sign-In:", err)});
  };

  return (
    <div className='d-flex align-items-center justify-content-center vh-100 flex-column'>
      <h1 className='mb-3'>Sign in with Google</h1>
      <GoogleButton onClick={signInWithGoogle}/>
    </div>
  )
}