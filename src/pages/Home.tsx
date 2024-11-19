import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'
import { auth, db } from '../firebase-config';
import Post from '../components/Post';
import { Col, Row } from 'react-bootstrap';

type Props = {
  isAuth: boolean;
}

interface IPost {
  id: string;
  title: string;
  post: string;
  createdAt: Date;
  author: {
    name: string;
    photoURL: string;
    id: string;
  };
  likes: string[];
  comments: [
    {
      commentText: string;
      authorId: string;
      createdAt: Date;
      id: string;
    }
  ];
}

function Home({isAuth}: Props) {

  const [postList, setPostList] = useState<IPost[]>([]);
  const postsCollectionRef = collection(db, "posts");

  const deletePost = useCallback(async (id: string) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  }, []);

  useEffect(() => {
    const getPosts = async () => {

      const q = query(postsCollectionRef, orderBy("createdAt", "desc"));

      const data = await getDocs(q);
      console.log(data.docs);
      setPostList(data.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || '',
        post: doc.data().post || '',
        createdAt: doc.data().createdAt?.toDate(),
        author: {
          name: doc.data().author?.name || 'Unknown',
          photoURL: doc.data().author?.photoURL || '',  
          id: doc.data().author?.id,
        },
        likes: doc.data().likes || [],
        comments: (doc.data().comments || []).map((comment: any) => ({
          commentText: comment.commentText || '',
          authorId: comment.authorId || '',
          createdAt: comment.createdAt,
          id: comment.id,
        })),
      })));
    }

    getPosts();
  }, [deletePost])


  return (
    <div className=''>
      <Row className='container-fluid mx-auto'> 
        {postList.map((post) => (
          <Col lg={3} md={5} sm={7} xs={12} key={post.id} className='mb-3'>
            <Post 
              title={post.title} 
              post={post.post} 
              author={post.author} 
              deleteDoc={deletePost} 
              id={post.id} 
              isAuth={isAuth} 
              uid={auth.currentUser?.uid || ''} 
              createdAt={post.createdAt}
              likes={post.likes}
              comments={post.comments}/>
          </Col>
        ))}
        
        </Row>
      </div>
  )
}

export default Home