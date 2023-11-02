import {dataApi} from "./api";
import {handleApiErrors} from "../helper/errorCatching";


export async function getData(vendor_id) {
    try {
        const response = await dataApi.get(`/getData/${vendor_id}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function subscribe(vendor_id, user_type, subscription_type, auto_renew) {
    try {
        const response = await dataApi.post(`/subscribe/${vendor_id}/${user_type}/${subscription_type}/${auto_renew}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function getSubscription(vendor_id, user_type) {
    try {
        const response = await dataApi.get(`/subscribe/${vendor_id}/${user_type}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function renewSubscription(vendor_id, user_type, subscription_type, auto_renew) {
    try {
        const response = await dataApi.put(`/subscribe/${vendor_id}/${user_type}/${subscription_type}/${auto_renew}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function unsubscribe(vendor_id, user_type) {
    try {
        const response = await dataApi.delete(`/subscribe/${vendor_id}/${user_type}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}