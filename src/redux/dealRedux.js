import {dealsApi} from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function createDeal(dealToCreate, vendorId) {
  try {
    const response = await dealsApi.post(`/create/${vendorId}`, dealToCreate);
    console.log(response)
    return handleApiErrors(response);
  } catch (error) {
    console.error("dealRedux createDeal Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getLastDealId() {
  try {
    const response = await dealsApi.get(`/getLastDealId`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("dealRedux getLastAttractionId Error: ", error);
    return { status: false, data: error.message };
  }
}
export async function getAssociatedDealList(vendorId) {
  try {
    const response = await dealsApi.get(`/getVendorDealList/${vendorId}`);
    console.log(response)
    return handleApiErrors(response);
  } catch (error) {
    console.error("dealRedux getAssociatedDealList Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getDealById(dealId) {
  try {
    const response = await dealsApi.get(`/getDealById/${dealId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("dealRedux getDealById Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function updateDeal(dealToEdit) {
  try {
    const response = await dealsApi.put(`/update`, dealToEdit);
    return handleApiErrors(response);
  } catch (error) {
    console.error("dealRedux updateDeal Error : ", error);
    return {status: false, data: error.message};
  }
}