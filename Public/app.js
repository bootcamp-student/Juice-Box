// Define the createPost function
async function createPost(postData) {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add authorization header
        },
        body: JSON.stringify(postData)
    });
    if (!response.ok) {
        console.error('Failed to create post:', response.status);
        const errorData = await response.json();
        console.error('Error message:', errorData.message);
        throw new Error('Failed to create post');
    }

    const data = await response.json();
    return data;
}

// Handle the create post form submission
document.getElementById('create-post-button').addEventListener('click', function (event) {
    // Show the create post form when the button is clicked
    document.getElementById('create-post-form').style.display = 'block';
});

document.getElementById('create-post-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const authorId = sessionStorage.getItem('userId'); // Retrieve the user ID from the session
    const tags = document.getElementById('post-tags').value.split(','); // Retrieve tags from a text input and split by comma
    await createPost({ authorId, title, content, tags });
});

// Define the getAllPosts function
async function getAllPosts() {
    const response = await fetch('http://localhost:3000/api/posts');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const posts = await response.json();
    return posts.posts
}

// Handle the show posts button click
document.getElementById('show-posts-button').addEventListener('click', function() {
    // Fetch posts from the server
    fetch('/api/posts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check if data.posts is an array
            if (!Array.isArray(data.posts)) {
                throw new Error('Posts data is not an array');
            }

            // Iterate over each post and create elements
            data.posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <h3 style="color: red;">Title:</h3>
                    <h4>${post.title}</h4>
                    <h3 style="color: red;">Content:</h3>
                    <h4>${post.content}</h4>
                    <button>Like</button>
                    <hr>
                `;
                postElement.querySelector('button').addEventListener('click', function () {
                    likePost(post.id);
                });
                postsDiv.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error:', error));
});


const postsDiv = document.getElementById('posts');
// Handle the register form submission
document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    const location = document.getElementById('register-location').value;
    register(username, password, name, location);
});

// Register function
function register(username, password, name, location) {
    fetch('http://localhost:3000/api/users/register', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, name, location })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data here
            console.log(data);
            // Display a success message for registration
            const registrationMessage = document.createElement('p');
            registrationMessage.textContent = 'Registration successful!';
            document.getElementById('root').appendChild(registrationMessage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Handle the login form submission
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    login(username, password);
});

// Login function
function login(username, password) {
    fetch('http://localhost:3000/api/users/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data here
            console.log(data);
            // Extract token from response and store it securely
            const token = data.token;
            localStorage.setItem('token', token); // Store token in local storage
            // Display a success message for login
            const loginMessage = document.createElement('p');
            loginMessage.textContent = 'Login successful!';
            document.getElementById('root').appendChild(loginMessage);
            // Optionally, you can redirect the user to a different page or perform other actions
            // after successful login
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



// Define the likePost function
async function likePost(postId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add authorization header
        }
    });
    if (!response.ok) {
        console.error('Failed to like post:', response.status);
        const errorData = await response.json();
        console.error('Error message:', errorData.message);
        throw new Error('Failed to like post');
    }

    const data = await response.json();
    return data;
}

// Add event listener to like button
document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', function (event) {
        const postId = event.target.dataset.postId;
        likePost(postId);
    });
});
