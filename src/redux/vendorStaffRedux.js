import axios from "axios";
import { userApi, vendorStaffApi } from "./api";

const vendorStaffURL = "http://localhost:8080/vendorStaff";

export async function createVendorStaff(vendorStaff) { // not intial signup
  console.log("Enter createVendorStaff function");
  console.log(vendorStaff);
  return await vendorStaffApi.post(`/createVendorStaff`, vendorStaff)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in vendorStaffRedux :: createVendorStaff');
      return {status: false, data: response.data};
    } else { // success
      console.log("success in vendorStaffRedux :: createVendorStaff");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("VendorStaffRedux createVendorStaff Error : ", error);
  });
}

export async function editVendorStaffProfile(edittedProfile) {
  console.log("Enter editVendorStaffProfile function");
  return await vendorStaffApi.put(`/editVendorStaffProfile`, edittedProfile)
  .then((response) => {
    console.log(response);
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in vendorStaffRedux :: editVendorStaffProfile :: vendor')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in vendorStaffRedux :: editVendorStaffProfile :: vendor");
      console.log(response.data);
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("vendorStaffRedux editVendorStaffProfile: ", error);
  });
}

export async function getAllAssociatedVendorStaff(vendorId) {
  console.log("Enter getAllAssociatedVendorStaff function");
  return await vendorStaffApi.get(`/getAllAssociatedVendorStaff/${vendorId}`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in vendorStaffRedux :: getAllAssociatedVendorStaff')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in vendorStaffRedux :: getAllAssociatedVendorStaff");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("vendorStaffRedux getAllAssociatedVendorStaff Error : ", error);
  });
}

export async function toggleVendorStaffBlock(vendorStaffId) {
  console.log("Enter toggleVendorStaffBlock function");
  return await vendorStaffApi.put(`/toggleBlock/${vendorStaffId}`)
  .then((response) => {
    console.log(response);
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in vendorStaffRedux :: toggleVendorStaffBlock')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in vendorStaffRedux :: toggleVendorStaffBlock");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("vendorStaffRedux toggleVendorStaffBlock Error : ", error);
  });
}

export async function verifyEmail(token) {
  return await vendorStaffApi.get(`/verifyEmail/${token}`)
  .then((response) => {
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) {
          return { status: false, data: response.data };
      } else {
          return { status: true, data: response.data };
      }
  })
  .catch((error) => {
      console.error("VendorStaffRedux verifyEmail Error : ", error);
  });
}