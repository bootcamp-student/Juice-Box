import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    };

    const handlePostSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/posts', { text: newPost });
            setPosts([...posts, response.data]);
            setNewPost('');
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response) {
                // The request was made and the server responded with a status code proxy
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
    };

    return (
        <div>
            <h1>Posts</h1>
            <form onSubmit={handlePostSubmit}>
                <input
                    type="text"
                    value={newPost}
                    onChange={(event) => setNewPost(event.target.value)}
                    placeholder="What's on your mind?"
                />
                <button type="submit">Post</button>
            </form>
            {posts.map((post) => (
                <div key={post.id}>
                    <p>{post.text}</p>
                </div>
            ))}
        </div>
    );
}

export default Posts;