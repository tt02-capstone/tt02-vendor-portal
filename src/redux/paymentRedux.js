import { paymentApi } from "./api";

export async function getVendorTotalEarnings(vendorId) {
    return await paymentApi.get(`/getVendorTotalEarnings/${vendorId}`)
    .then((response) => {
        if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) { // error
        return {status: false, data: response.data};
      } else { // success
        return {status: true, data: response.data};
      }
    })
    .catch((error) => {
      console.error("paymentRedux getAttractionBookingListByVendor Error : ", error);
    });
}

export async function getTourTotalEarningForLocal(localId) {
    return await paymentApi.get(`/getTourTotalEarningForLocal/${localId}`)
    .then((response) => {
        if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) { // error
        return {status: false, data: response.data};
        } else { // success
        return {status: true, data: response.data};
        }
    })
    .catch((error) => {
        console.error("paymentRedux getTourTotalEarningForLocal Error : ", error);
    });
}