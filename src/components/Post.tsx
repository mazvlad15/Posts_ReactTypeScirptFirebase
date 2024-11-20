import React, { useState, useEffect, useReducer } from 'react';
import Toast from 'react-bootstrap/Toast';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { formatDistanceToNow } from 'date-fns';
import { updateDoc, arrayUnion, arrayRemove, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import Comment from './Comment';
import ModeCommentIcon from '@mui/icons-material/ModeComment';

type Props = {
    title: string;
    post: string;
    author: {
        name: string;
        photoURL: string;
        id: string;
    };
    deleteDoc: (id: string) => void;
    id: string;
    isAuth: boolean;
    uid: string | undefined;
    createdAt: Date;
    likes: string[];
    comments: [
        {
            commentText: string;
            authorId: string;
            createdAt: Date;
            id: string;
        }
    ];
};

type State = {
    like: boolean;
    numberOfLikes: number;
};

type Action =
    | { type: 'LIKE'; uid: string }
    | { type: 'UNLIKE'; uid: string }
    | { type: 'RESET'; likes: string[]; uid: string };

const likeReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'LIKE':
            return { like: true, numberOfLikes: state.numberOfLikes + 1 };
        case 'UNLIKE':
            return { like: false, numberOfLikes: state.numberOfLikes - 1 };
        case 'RESET':
            return {
                like: action.likes.includes(action.uid),
                numberOfLikes: action.likes.length,
            };
        default:
            return state;
    }
};


export default function Post({ title, post, author: { name, photoURL, id }, deleteDoc, id: postId, isAuth, uid, createdAt, likes, comments }: Props) {

    const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "Just now";

    const [show, setShow] = useState<boolean>(false);
    const [state, dispatch] = useReducer(likeReducer, {
        like: likes.includes(uid || ''),
        numberOfLikes: likes.length,
    });


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLike = async () => {
        if (!uid) return;

        const postRef = doc(db, "posts", postId);

        if (state.like) {
            await updateDoc(postRef, {
                likes: arrayRemove(uid)
            });
            dispatch({ type: 'UNLIKE', uid });
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(uid)
            });
            dispatch({ type: 'LIKE', uid });
        }
    };

    useEffect(() => {
        dispatch({ type: 'RESET', likes, uid: uid || '' });
    }, [likes, uid]);



    return (
        <Toast onClose={() => deleteDoc(postId)}>
            <Toast.Header closeButton={isAuth && id === uid}>
                <img src={photoURL} className="rounded me-2" width="20px" alt="" />
                <strong className="me-auto">{name}</strong>
                <small>{timeAgo}</small>
            </Toast.Header>
            <Toast.Body style={{
                height: '100px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
            }}>
                <strong>{title}</strong>
                <br />
                {post}
            </Toast.Body>
            <Toast.Body className='d-flex align-items-center'>
                {state.like ? 
                    <FavoriteIcon style={{ cursor: 'pointer' }} onClick={handleLike} /> : 
                    <FavoriteBorderIcon style={{ cursor: 'pointer' }} onClick={handleLike} />
                }
                <span className='ms-1' style={{fontFamily: 'Space Grotesk, serif'}}>{state.numberOfLikes}</span>
                <Comment 
                    handleClose={handleClose} 
                    show={show} 
                    postId={postId} 
                    comments={comments} 
                    authorId={id} 
                    isAuth={isAuth} 
                    uid={uid}
                    name={name}
                    photoURL={photoURL}/>
                <ModeCommentIcon className='ms-auto me-2' onClick={handleShow} style={{ cursor: 'pointer' }} />
            </Toast.Body>
        </Toast>
    );
}
