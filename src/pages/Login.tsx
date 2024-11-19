import React from 'react'
import GoogleButton from 'react-google-button'
import 'bootstrap/dist/css/bootstrap.min.css'
import { signInWithPopup, getAuth } from 'firebase/auth';
import { auth, provider } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

type Props = {
  setIsAuth: (isAuth: boolean) => void;
}

const createUserInFirestore = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        displayName: user.displayName || "Anonymous",  
        photoURL: user.photoURL || "",
      });
    }
  }
};


export default function Login({ setIsAuth }: Props) {

  let navigate = useNavigate();

  const signInWithGoogle = (): void => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", "true");
      setIsAuth(true);
      createUserInFirestore();
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