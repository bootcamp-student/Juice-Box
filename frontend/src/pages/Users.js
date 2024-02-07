import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
        <div>
            <h1>Users</h1>
            {users.map(user => (
                <div key={user.id}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
}

export default Users;