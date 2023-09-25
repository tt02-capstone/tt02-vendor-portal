import { telecomApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function createTelecom(telecomToCreate, vendorId) {
  try {
    const response = await telecomApi.post(`/create/${vendorId}`, telecomToCreate);
    return handleApiErrors(response);
  } catch (error) {
    console.error("telecomRedux createTelecom Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getAssociatedTelecomList(vendorId) {
  try {
    const response = await telecomApi.get(`/getAssociatedTelecomList/${vendorId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("telecomRedux getAssociatedTelecomList Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getTelecomById(telecomId) {
  try {
    const response = await telecomApi.get(`/getTelecomById/${telecomId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("telecomRedux getTelecomById Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function updateTelecom(telecomToEdit) {
  try {
    const response = await telecomApi.put(`/update`, telecomToEdit);
    return handleApiErrors(response);
  } catch (error) {
    console.error("telecomRedux updateTelecom Error : ", error);
    return {status: false, data: error.message};
  }
}