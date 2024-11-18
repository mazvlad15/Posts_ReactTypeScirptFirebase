import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

type Props = {
  isAuth: boolean
};

interface IAuthor {
  name: string | null;
  id: string | undefined;
  photoURL: string | null;
}

export default function CreatePost({ isAuth }: Props) {
  let navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [post, setPost] = useState<string>('');

  const postsCollectionRef = collection(db, "posts");

  const createPost = async () => {
    if (!auth.currentUser) {
      console.log('User not authenticated');
      return;
    }

    const author: IAuthor = {
      name: auth.currentUser?.displayName,
      id: auth.currentUser?.uid,
      photoURL: auth.currentUser?.photoURL,
    };

    try {
      await addDoc(postsCollectionRef, {
        title,
        post,
        author,
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate])


  return (
    <div className="container d-flex align-items-center justify-content-center mb-5">
      <form
        className="p-5 rounded"
        style={{
          backgroundColor: '#121212',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <h2 className="mb-4 text-center" style={{ color: '#00aaff' }}>
          Create a Post
        </h2>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title"
            style={{
              backgroundColor: '#1e1e1e',
              color: '#ffffff',
              borderColor: '#00aaff',
            }}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="post" className="form-label">
            Post
          </label>
          <textarea
            className="form-control"
            id="post"
            rows={4}
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="Write your post here..."
            style={{
              backgroundColor: '#1e1e1e',
              color: '#ffffff',
              borderColor: '#00aaff',
            }}
            required
          />
        </div>
        <button
          onClick={(e) => {createPost(); e.preventDefault()}}
          type="submit"
          className="btn btn-primary w-100"
          style={{
            backgroundColor: '#00aaff',
            borderColor: '#008ecc',
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
