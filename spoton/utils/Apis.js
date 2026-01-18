import axios from "axios";

const BASE_URL = 'http://192.168.1.2:8080/spot-on';

export const endpoints = {
    'register': '/users/register',
    'login': '/auth/log-in',
    'currentUser': '/secure/me',
    'updateUser': (id) => `users/${id}`,

    'getEvents': '/events',
    'getEvent': (id) => `/events/${id}`,
    'getNewEvents': '/events/new',
    'getTopEvents': '/events/top',
    'check-in': '/check-in',
    'getRecomment': (userId) => `/user-genre/recomment/${userId}`,
    'interaction': (eventId, userId, action) => `/user-genre/${eventId}/${userId}/${action}`,


    'getSections': (eventId) => `/sections?eventId=${eventId}`,


    'getEventMerchandises': '/event-merchandise',


    'getVoucherByCode': (code) => `/vouchers/code/${code}`,


    'createInvoice': '/invoices',
    'getInvoices': (userId) => `/invoices/user/${userId}`,
    'getTicketOfInvoice': (id) => `/invoices/${id}/tickets`,


    'createPaymentUrl': '/vnpay/create-payment',


    'getPosts': '/posts',
    'createPost': '/posts',


    'like': '/emotions',


    'getParentComments': '/comments/parents',
    'createComment': '/comments',
    'getChildrenComment': '/comments/children',
    'getNumberOfComment': (postId) => `/comments/amount/${postId}`,


    'createEvaluation': '/evaluations',
    'getEvaluations': (eventId) => `events/${eventId}/evaluations`,


    'daily-coins': (id) => `/daily-coins/${id}`,


    'getMonthlyStats': (id) => `/invoices/stats/user/month/${id}`,
    'getYearlyStats': (id) => `/invoices/stats/user/year/${id}`,


    'getGenres': '/genres'
}

export default axios.create({
    baseURL: BASE_URL
});


export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}


export const provinceApis = () => {
    return axios.create({
        baseURL: "https://provinces.open-api.vn/api/v1/",
    })
}

