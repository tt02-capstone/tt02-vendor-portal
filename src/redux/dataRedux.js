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