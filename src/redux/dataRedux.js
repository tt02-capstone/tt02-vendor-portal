import {dataApi} from "./api";
import {handleApiErrors} from "../helper/errorCatching";


export async function getData(data_usecase, type, vendor_id, start_date, end_date) {
    try {
        console.log(data_usecase, type, vendor_id, start_date, end_date);

        const requestBody = {
            'start_date': start_date,
            'end_date': end_date
        };

        const response = await dataApi.post(`/getData/${data_usecase}/${type}/${vendor_id}`, requestBody);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function subscribe(user_id, user_type, subscription_type, auto_renew) {
    try {
        const response = await dataApi.post(`/subscribe/${user_id}/${user_type}/${subscription_type}/${auto_renew}`);
        console.log(response)
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function getSubscriptionStatus(user_id, user_type) {
    try {
        const response = await dataApi.get(`/getSubscriptionStatus/${user_id}/${user_type}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function getSubscription(user_id, user_type) {
    try {
        console.log(user_id, user_type)
        const response = await dataApi.get(`/getSubscription/${user_id}/${user_type}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function renewSubscription(subscription_id) {
    try {
        console.log(subscription_id)
        const response = await dataApi.put(`/renewSubscription/${subscription_id}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function updateSubscription(subscription_id, subscription_type, auto_renew) {
    try {
        const response = await dataApi.put(`/updateSubscription/${subscription_id}/${subscription_type}/${auto_renew}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function unsubscribe(subscription_id) {
    try {
        const response = await dataApi.delete(`/cancelSubscription/${subscription_id}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}