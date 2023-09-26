import { attractionApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const attractionURL = "http://localhost:8080/attraction";

export async function getAttractionListByVendor(vendorStaffId) {
  try {
    const response = await attractionApi.get(`${attractionURL}/getAttractionListByVendor/${vendorStaffId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("attractionRedux getAttractionListByVendor Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getAttractionByVendor(vendorStaffId, attractionId) {
  try {
    const response = await attractionApi.get(`${attractionURL}/getAttractionByVendor/${vendorStaffId}/${attractionId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("attractionRedux getAttractionByVendor Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function createAttraction(vendorStaffId,attraction) {
  try {
    const response = await attractionApi.post(`${attractionURL}/createAttraction/${vendorStaffId}`, attraction);
    return handleApiErrors(response);
  } catch (error) {
    console.error("attractionRedux createAttraction Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function updateAttraction(vendorStaffId, attraction) {
  try {
    const response = await attractionApi.put(`${attractionURL}/updateAttraction/${vendorStaffId}`, attraction);
    return handleApiErrors(response);
  } catch (error) {
    console.error("attractionRedux updateAttraction Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getLastAttractionId() {
  try {
    const response = await attractionApi.get(`${attractionURL}/getLastAttractionId`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("attractionRedux getLastAttractionId Error: ", error);
    return { status: false, data: error.message };
  }
}

export async function createSeasonalActivity(vendor_id,attraction_id,activity) {
  try {
      const response = await attractionApi.post(`/createSeasonalActivity/${vendor_id}/${attraction_id}`, activity);
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422 ) {
          return {error : response.data.errorMessage};
      } else {
          return response.data;
      } 
  } catch (error) {
      console.error("Create seasonal activity error!");
      return {status: false, data: error.message};
  }
}