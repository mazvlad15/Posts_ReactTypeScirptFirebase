import React, { useState, useEffect } from 'react';
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

export default function Post({ title, post, author: { name, photoURL, id }, deleteDoc, id: postId, isAuth, uid, createdAt, likes, comments }: Props) {

    const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "Just now";

    const [like, setLike] = useState<boolean>(likes.includes(uid || ''));
    const [show, setShow] = useState<boolean>(false);
    const [numberOfLikes, setNumberOfLikes] = useState<number>(likes.length);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLike = async () => {
        if (!uid) return;

        const postRef = doc(db, "posts", postId);

        if (like) {
            await updateDoc(postRef, {
                likes: arrayRemove(uid)
            });
            setNumberOfLikes(prev => prev - 1);
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(uid)
            });
            setNumberOfLikes(prev => prev + 1);
        }

        setLike(!like);
    };

    useEffect(() => {
        setLike(likes.includes(uid || ''));
        setNumberOfLikes(likes.length);
    }, []);



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
                {like ? 
                    <FavoriteIcon style={{ cursor: 'pointer' }} onClick={handleLike} /> : 
                    <FavoriteBorderIcon style={{ cursor: 'pointer' }} onClick={handleLike} />
                }
                <span className='ms-1' style={{fontFamily: 'Space Grotesk, serif'}}>{numberOfLikes}</span>
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
