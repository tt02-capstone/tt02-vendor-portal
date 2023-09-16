import axios from "axios";

const bookingURL = "http://localhost:8080/booking";

export async function getAttractionBookingListByVendor(vendorStaffId) {
    return await axios.get(`${bookingURL}/getAllAttractionBookingsByVendor/${vendorStaffId}`)
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
    return await axios.get(`${bookingURL}/getAttractionBookingByVendor/${vendorStaffId}/${bookingId}`)
    .then((response) => {
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
        return {status: false, data: response.data};
      } else { // success
        return {status: true, data: response.data};
      }
    })
    .catch((error) => {
      console.error("bookingRedux getAttractionBookingByVendor Error : ", error);
    });
  }