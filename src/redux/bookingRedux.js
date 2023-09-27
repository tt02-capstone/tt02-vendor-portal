import { bookingApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const bookingURL = "http://localhost:8080/booking";

export async function getBookingListByVendor(vendorStaffId) {
  try {
    const response = await bookingApi.get(`/getAllBookingsByVendor/${vendorStaffId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("bookingRedux getBookingListByVendor Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getBookingById(id) {
  try {
    const response = await bookingApi.get(`/getBookingByBookingId/${id}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("bookingRedux getBookingById Error : ", error);
    return {status: false, data: error.message};
  }
}
  
export async function getBookingByVendor(vendorStaffId, bookingId) {
  try {
    const response = await bookingApi.get(`/getBookingByVendor/${vendorStaffId}/${bookingId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("bookingRedux getBookingByVendor Error : ", error);
    return {status: false, data: error.message};
  }
}