import { Paper } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Comments from '../components/Comments';

export default function Home() {
    // below is going to be an array, so we set it to an empty array
    const [posts, setPosts] = useState([]);


   useEffect(() => {
       fetch('/api/v1/posts')
        .then(res => res.json())
        .then(data => {
            setPosts(data);
        })
   }, [])
    
    return (
        <div>
            <h1>Blog Posts</h1>
            {
                posts.map((post) => {
                    return (
                        <Paper key={post.id} elevation={4} style={{ marginBotton: '2em' }}>
                            <h2>{post.title}</h2>
                            <h4>{post.User.username}</h4>
                            <p>{post.content}</p>
                            {/* below means that props.id equals whatever post we are mapping over */}
                            <Comments postId={post.id} />
                        </Paper>
                    );
                })
            }
        </div>
        );
}  

