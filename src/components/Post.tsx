import React from 'react';
import Toast from 'react-bootstrap/Toast';

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
};

export default function Post({ title, post, author: { name, photoURL, id }, deleteDoc, id: postId, isAuth, uid }: Props) {
    return (
        <Toast onClose={() => deleteDoc(postId)}>
            <Toast.Header closeButton={isAuth && id === uid}>
                <img src={photoURL} className="rounded me-2" width="20px" alt="" />
                <strong className="me-auto">{name}</strong>
                <small>{new Date().getFullYear()}</small>
            </Toast.Header>
            <Toast.Body
                style={{
                    height: '100px',
                    overflowY: 'auto',    
                    whiteSpace: 'pre-wrap', 
                }}
            >
                <strong>{title}</strong>
                <br />
                {post}
            </Toast.Body>
            <Toast.Body>

            </Toast.Body>
        </Toast>
    );
}
