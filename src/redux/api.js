import axios from "axios";
import {TOKEN_KEY} from "./AuthContext";

const HOST = 'localhost'
const HOST_WITH_PORT = `http://${HOST}:8080`

export const userApi = axios.create({
    baseURL: HOST_WITH_PORT + '/user'
})

export const adminApi = axios.create({
    baseURL: HOST_WITH_PORT + '/admin'
})

export const touristApi = axios.create({
    baseURL: HOST_WITH_PORT + '/tourist'
})

export const localApi = axios.create({
    baseURL: HOST_WITH_PORT + '/local'
})

export const vendorApi = axios.create({
    baseURL: HOST_WITH_PORT + '/vendor'
})

export const vendorStaffApi = axios.create({
    baseURL: HOST_WITH_PORT + '/vendorStaff'
})

export const bookingApi = axios.create({
    baseURL: HOST_WITH_PORT + '/booking'
})

export const attractionApi = axios.create({
    baseURL: HOST_WITH_PORT + '/attraction'
})

export const paymentApi = axios.create({
    baseURL: HOST_WITH_PORT + '/payment'
})

const instanceList = [userApi, localApi, adminApi, bookingApi, vendorApi, vendorStaffApi, paymentApi, touristApi, attractionApi]

instanceList.map((api) => {
    api.interceptors.request.use( (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        config.headers.Authorization =  token ? `Bearer ${token}` : '';
        return config;
    });
})



