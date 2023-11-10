import {bookingApi, itemApi} from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getBookingListByVendor(vendorStaffId) {
  try {
    const response = await bookingApi.get(`/getAllBookingsByVendor/${vendorStaffId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("bookingRedux getBookingListByVendor Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getAllItemBookingsByVendor(vendorStaffId) {
  try {
    const response = await bookingApi.get(`/getAllItemBookingsByVendor/${vendorStaffId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("bookingRedux getBookingListByVendor Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function updateBookingItemStatus(bookingId, bookingStatus) {
  try {
    const response = await bookingApi.put(`/updateBookingItemStatus/${bookingId}?status=${bookingStatus}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("itemRedux retrieveAllItemsByVendor Error : ", error);
    return { status: false, data: error.message };
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