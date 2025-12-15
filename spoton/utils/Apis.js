import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = 'http://192.168.1.2:8080/spot-on';

export const endpoints = {
    'register': '/users/register',
    'login': '/auth/log-in',
    'currentUser': '/secure/me',
    'getEvents' : '/events'
}

export default axios.create({
    baseURL: BASE_URL
});

export const authApis = async () => {
    const token = await AsyncStorage.getItem('token');
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

