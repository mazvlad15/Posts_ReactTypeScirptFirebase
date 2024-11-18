import React, { useState, useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { formatDistanceToNow } from 'date-fns';
import { updateDoc, arrayUnion, arrayRemove, doc } from 'firebase/firestore';
import { db } from '../firebase-config';

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
};

export default function Post({ title, post, author: { name, photoURL, id }, deleteDoc, id: postId, isAuth, uid, createdAt, likes }: Props) {

    const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "Just now";

    const [like, setLike] = useState<boolean>(likes.includes(uid || ''));

    useEffect(() => {
        setLike(likes.includes(uid || ''));
    }, [likes, uid]);

    const handleLike = async () => {
        if (!uid) return;

        const postRef = doc(db, "posts", postId);

        if (like) {
            await updateDoc(postRef, {
                likes: arrayRemove(uid)
            });
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(uid)
            });
        }

        setLike(!like);
    };

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
            <Toast.Body className='d-flex'>
                {like ? 
                    <FavoriteIcon style={{ cursor: 'pointer' }} onClick={handleLike} /> : 
                    <FavoriteBorderIcon style={{ cursor: 'pointer' }} onClick={handleLike} />
                }
                <span className='ms-auto' style={{fontFamily: 'Space Grotesk, serif'}}>{likes.length}</span>
            </Toast.Body>
        </Toast>
    );
}
