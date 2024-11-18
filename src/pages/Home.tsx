import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
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
  author: {
    name: string;
    photoURL: string;
    id: string;
  };
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
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || '',
        post: doc.data().post || '',
        author: {
          name: doc.data().author?.name || 'Unknown',
          photoURL: doc.data().author?.photoURL || '',  
          id: doc.data().author?.id,
        },
      })));
    }

    getPosts();
  }, [deletePost, postsCollectionRef])


  return (
    <div className=''>
      <Row className='container-fluid mx-auto'> 
        {postList.map((post) => (
          <Col lg={3} md={5} sm={7} xs={12} key={post.id} className='mb-3'>
            <Post title={post.title} post={post.post} author={post.author} deleteDoc={deletePost} id={post.id} isAuth={isAuth} uid={auth.currentUser?.uid || ''}/>
          </Col>
        ))}
        </Row>
      </div>
  )
}

export default Home