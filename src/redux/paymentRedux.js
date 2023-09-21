import { paymentApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getVendorTotalEarnings(vendorId) {
  try {
    const response = await paymentApi.get(`/getVendorTotalEarnings/${vendorId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("paymentRedux getVendorTotalEarnings Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getTourTotalEarningForLocal(localId) {
  try {
    const response = await paymentApi.get(`/getTourTotalEarningForLocal/${localId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("paymentRedux getTourTotalEarningForLocal Error : ", error);
    return {status: false, data: error.message};
  }
}