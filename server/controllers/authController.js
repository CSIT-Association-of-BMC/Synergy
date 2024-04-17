import { getClient } from '../config.js';


export const registerUser = async (req, res) => {
    res.json({ message: 'Register Endpoint'});
}

export const loginUser = async (req, res) => {
    res.json({ message: 'Login Endpoint'});
}