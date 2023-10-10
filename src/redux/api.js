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

export const accommodationApi = axios.create({
    baseURL: HOST_WITH_PORT + '/accommodation'
})

export const paymentApi = axios.create({
    baseURL: HOST_WITH_PORT + '/payment'
})

export const telecomApi = axios.create({
    baseURL: HOST_WITH_PORT + '/telecom'
})

export const tourApi = axios.create({
    baseURL: HOST_WITH_PORT + '/tour'
})

export const restaurantApi = axios.create({
    baseURL: HOST_WITH_PORT + '/restaurant'
})

export const dealsApi = axios.create({
    baseURL: HOST_WITH_PORT + '/deal'
})

export const categoryApi = axios.create({
    baseURL: HOST_WITH_PORT + '/category'
})

export const categoryItemApi = axios.create({
    baseURL: HOST_WITH_PORT + '/categoryItem'
})

export const postApi = axios.create({
    baseURL: HOST_WITH_PORT + '/post'
})

const instanceList = [userApi, localApi, adminApi, bookingApi, vendorApi, vendorStaffApi, paymentApi, touristApi, attractionApi, accommodationApi, telecomApi, tourApi, restaurantApi, dealsApi,categoryApi, categoryItemApi, postApi]

instanceList.map((api) => {
    api.interceptors.request.use( (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        config.headers.Authorization =  token ? `Bearer ${token}` : '';
        return config;
    });
})

const refreshToken = async () => {
    try {
        const resp = await userApi.get("/refreshToken");
        return resp.data;
    } catch (e) {
        console.log("Error",e);
    }
};

instanceList.map((api) => {
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async function (error) {
            const originalRequest = error.config;
            //403 Network error does not return status code so -> using !error.status instead
            if (!error.status && !originalRequest._retry) {
                originalRequest._retry = true;
                const resp = await refreshToken();
                const newToken = resp.refreshToken;
                console.log("Refresh token", newToken)

                localStorage.setItem(TOKEN_KEY, newToken);
                axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                return api(originalRequest);
            }
            return Promise.reject(error);
        }
    );
})
