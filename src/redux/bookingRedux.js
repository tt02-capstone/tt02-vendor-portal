import { bookingApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const bookingURL = "http://localhost:8080/booking";

export async function getAttractionBookingListByVendor(vendorStaffId) {
  try {
    const response = await bookingApi.get(`${bookingURL}/getAllAttractionBookingsByVendor/${vendorStaffId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("bookingRedux getAttractionBookingListByVendor Error : ", error);
    // response.message.error
  }
}
  
export async function getAttractionBookingByVendor(vendorStaffId, bookingId) {
  try {
    const response = await bookingApi.get(`${bookingURL}/getAttractionBookingByVendor/${vendorStaffId}/${bookingId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("bookingRedux getAttractionBookingByVendor Error : ", error);
    // response.message.error
  }
}