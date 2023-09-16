import { bookingApi } from "./api";

const bookingURL = "http://localhost:8080/booking";

export async function getAttractionBookingListByVendor(vendorStaffId) {
    return await bookingApi.get(`${bookingURL}/getAllAttractionBookingsByVendor/${vendorStaffId}`)
    .then((response) => {
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
        return {status: false, data: response.data};
      } else { // success
        return {status: true, data: response.data};
      }
    })
    .catch((error) => {
      console.error("bookingRedux getAttractionBookingListByVendor Error : ", error);
    });
  }
  
  export async function getAttractionBookingByVendor(vendorStaffId, bookingId) {
    return await bookingApi.get(`${bookingURL}/getAttractionBookingByVendor/${vendorStaffId}/${bookingId}`)
    .then((response) => {
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
        return {status: false, data: response.data};
      } else { // success
        return {status: true, data: response.data};
      }
    })
    .catch((error) => {
      console.error("bookingRedux getAttractionByVendor Error : ", error);
    });
  }