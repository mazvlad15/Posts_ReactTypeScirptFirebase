import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import { doc } from "firebase/firestore";
import { db } from "../firebase-config";
import { updateDoc, arrayUnion, arrayRemove, collection } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import SendIcon from '@mui/icons-material/Send';
import "./styles/comment.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { CloseButton, Col, Row } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';

type Props = {
    show: boolean;
    handleClose: () => void;
    postId: string;
    comments: [
        {
            commentText: string;
            authorId: string;
            createdAt: Date;
            id: string;
        }
    ];
    authorId: string;
    isAuth: boolean;
    uid: string | undefined;
    name: string;
    photoURL: string;
}

type CommentWithAuthor = {
    commentText: string;
    authorId: string;
    authorName: string;
    authorPhoto: string;
    createdAt: Date | string;
    id: string;
};


function Comment({ handleClose, show, postId, comments, authorId, isAuth, uid }: Props) {

    const [commentsWithAuthors, setCommentsWithAuthors] = useState<CommentWithAuthor[]>([]);
    const [commentText, setCommentText] = useState<string>("");


    const fetchCommentsWithAuthors = async () => {
        const populatedComments = await Promise.all(
            comments.map(async (comment) => {
                const userDocRef = doc(db, "users", comment.authorId);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const authorData = docSnap.data();
                    return {
                        ...comment,
                        authorName: authorData.displayName || "Unknown",
                        authorPhoto: authorData.photoURL || "",
                        id: comment.id || "Unknown",
                    };
                } else {
                    return {
                        ...comment,
                        authorName: "Unknown",
                        authorPhoto: "",
                        id: comment.id || "Unknown",
                    };
                }
            })
        );
        setCommentsWithAuthors(populatedComments);
    };

    const addComment = async (commentText: string) => {
        const postRef = doc(db, "posts", postId);
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const authorId = user.uid;
    
        const newComment = {
            commentText,
            authorId,
            createdAt: new Date().toISOString(),
            id: uuidv4(),
        };

        setCommentsWithAuthors(prevComments => [
            ...prevComments,
            {
                ...newComment,
                authorName: user?.displayName || "Unknown",  // Adaugă numele autorului
                authorPhoto: user?.photoURL || "",         // Adaugă poza autorului
            }
        ]);

        await updateDoc(postRef, {
            comments: arrayUnion(newComment),
        });
        setCommentText(""); 
        
    };
    
    const deleteComment = useCallback(async (postId: string, commentId: string) => {
        const postRef = doc(db, "posts", postId);

        const commentToRemove = commentsWithAuthors.find(comment => comment.id === commentId);

        if (commentToRemove) {
            const commentWithoutExtraFields = {
                id: commentToRemove.id,
                authorId: commentToRemove.authorId,
                commentText: commentToRemove.commentText,
                createdAt: commentToRemove.createdAt
            };

            setCommentsWithAuthors(prevComments =>
                prevComments.filter(comment => comment.id !== commentId)
            );

            await updateDoc(postRef, {
                comments: arrayRemove(commentWithoutExtraFields)
            });
        }
    }, [commentsWithAuthors]);

    useEffect(() => {
        fetchCommentsWithAuthors();
    }, []);


    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {commentsWithAuthors.map((comment) => {
                        return <div className='my-2' key={comment.id}>
                            <Row className='d-flex ' key={comment.id}>
                                <Col xs='auto' className='pe-0'><img src={comment.authorPhoto} alt='author' width='25px' className='rounded' /></Col>
                                <Col className=''>
                                    <div className='fw-bold mb-0' style={{ fontSize: '12px' }}>{comment.authorName}</div>
                                    <div className='mt-0'>{comment.commentText}</div>
                                </Col>
                                <Col xs='auto' className='d-flex flex-column'>
                                    <div style={{ fontSize: '11px' }}>
                                        {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : "Just now"}
                                    </div>
                                    {isAuth && comment.authorId === uid &&
                                        <CloseButton className='ms-auto' onClick={() => { deleteComment(postId, comment.id) }}></CloseButton>
                                    }
                                </Col>
                            </Row>
                        </div>;
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <input className='inputMessage me-auto col-lg-11' value={commentText} type='text' placeholder='Comments...' onChange={(event) => {
                        setCommentText(event.target.value);
                    }}></input>
                    <SendIcon className='message' onClick={() => {
                        commentText !== "" &&
                            addComment(commentText)
                    }} />
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Comment