import axios from "axios";

const vendorStaffURL = "http://localhost:8080/vendorStaff";

export async function vendorStaffLogin(email, password) {
  console.log("Enter vendorStaffLogin function");
  return await axios.put(`${vendorStaffURL}/vendorStaffLogin/${email}/${password}`)
  .then((response) => {
    console.log(response);
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422 || response.data.httpStatusCode === 404) { // error
      console.log('failure in vendorStaffRedux :: vendorStaffLogin');
      return {status: false, data: response.data};
    } else { // success
      console.log("success in vendorStaffRedux :: vendorStaffLogin");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("VendorStaffRedux vendorStaffLogin Error : ", error);
  });
}

export async function createVendorStaff(vendorStaff) {
  console.log("Enter createVendorStaff function");
  return await axios.post(`${vendorStaffURL}/createVendorStaff`, vendorStaff)
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

export async function getVendorStaffProfile(vendorStaffId) {
  console.log("Enter getVendorStaffProfile function");
  return await axios.get(`${vendorStaffURL}/getVendorStaffProfile/${vendorStaffId}`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in vendorStaffRedux :: getVendorStaffProfile')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in vendorStaffRedux :: getVendorStaffProfile");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("vendorStaffRedux getVendorStaffProfile Error : ", error);
  });
}

export async function editVendorStaffProfile(editedVendorStaffProfile) {
  console.log("Enter editVendorStaffProfile function");
  return await axios.put(`${vendorStaffURL}/editVendorStaffProfile`, {...editedVendorStaffProfile, is_master_account: true})
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in vendorStaffRedux :: editVendorStaffProfile')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in vendorStaffRedux :: editVendorStaffProfile");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("VendorStaffRedux editVendorStaffProfile Error : ", error);
  });
}

export async function editVendorStaffPassword(vendorStaffId, oldPassword, newPassword) {
  console.log("Enter editVendorStaffProfile function");
  return await axios.put(`${vendorStaffURL}/editVendorStaffPassword/${vendorStaffId}/${oldPassword}/${newPassword}`)
  .then((response) => {
    console.log(response);
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in vendorStaffRedux :: editVendorStaffPassword')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in vendorStaffRedux :: editVendorStaffPassword");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("vendorStaffRedux editVendorStaffProfile Error : ", error);
  });
}