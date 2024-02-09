// auth.js
const express = require('express');

const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');

async function requireUser(req, res, next) {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(id);

        if (user) {
            req.user = user;
            next();
        } else {
            next({
                name: 'MissingUserError',
                message: 'Cannot find user'
            });
        }
    } catch (error) {
        next({
            name: 'InvalidTokenError',
            message: 'Token in Authorization header is invalid'
        });
    }
}

module.exports = {
    requireUser
}