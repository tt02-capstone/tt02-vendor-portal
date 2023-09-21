import { userApi, vendorStaffApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function createVendorStaff(vendorStaff) { // not intial signup

  try {
    const response = await vendorStaffApi.post(`/createVendorStaff`, vendorStaff);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux createVendorStaff Error : ", error);
    // response.message.error
  }
}

export async function editVendorStaffProfile(editedProfile) {

  try {
    const response = await vendorStaffApi.put(`/editVendorStaffProfile`, editedProfile);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux editVendorStaffProfile Error : ", error);
    // response.message.error
  }
}

export async function getAllAssociatedVendorStaff(vendorId) {
  try {
    const response = await vendorStaffApi.get(`/getAllAssociatedVendorStaff/${vendorId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux getAllAssociatedVendorStaff Error : ", error);
    // response.message.error
  }
}

export async function toggleVendorStaffBlock(vendorStaffId) {
  try {
    const response = await vendorStaffApi.put(`/toggleBlock/${vendorStaffId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux toggleVendorStaffBlock Error : ", error);
    // response.message.error
  }
}

export async function verifyEmail(token) {

  try {
    const response = await vendorStaffApi.get(`/verifyEmail/${token}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    // response.message.error
  }
}