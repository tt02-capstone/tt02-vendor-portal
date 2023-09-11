// import axios from "axios";

// const vendorStaffURL = "http://localhost:8080/vendorStaff";

// export async function createVendorStaff(vendorStaff) {
//   console.log("Enter createVendorStaff function");
//   return await axios.post(`${vendorStaffURL}/createVendorStaff`, vendorStaff)
//   .then((response) => {
//     if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
//       console.log('failure in vendorStaffRedux :: createVendorStaff');
//       return {status: false, data: response.data};
//     } else { // success
//       console.log("success in vendorStaffRedux :: createVendorStaff");
//       return {status: true, data: response.data};
//     }
//   })
//   .catch((error) => {
//     console.error("VendorStaffRedux createVendorStaff Error : ", error);
//   });
// }

// export async function getVendorStaffProfile(vendorStaffId) {
//   console.log("Enter getVendorStaffProfile function");
//   return await axios.get(`${vendorStaffURL}/getVendorStaffProfile/${vendorStaffId}`)
//   .then((response) => {
//     if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
//       console.log('failure in getVendorStaffProfile :: getVendorStaffProfile')
//       return {status: false, data: response.data};
//     } else { // success
//       console.log("success in getVendorStaffProfile :: getVendorStaffProfile");
//       return {status: true, data: response.data};
//     }
//   })
//   .catch((error) => {
//     console.error("vendorStaffRedux getVendorStaffProfile Error : ", error);
//   });
// }

// export async function editVendorStaffProfile(editedVendorStaffProfile) {
//   console.log("Enter editVendorStaffProfile function");
//   return await axios.put(`${vendorStaffURL}/editVendorStaffProfile`, editedVendorStaffProfile)
//   .then((response) => {
//     console.log(response);
//     if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
//       console.log('failure in vendorStaffRedux :: editVendorStaffProfile :: vendor')
//       return {status: false, data: response.data};
//     } else { // success
//       console.log("success in vendorStaffRedux :: editVendorStaffProfile :: vendor");
//       return {status: true, data: response.data};
//     }
//   })
//   .catch((error) => {
//     console.error("vendorStaffRedux editVendorStaffProfile :: Vendor Error : ", error);
//   });
// }

// export async function editVendorStaffPassword(vendorStaffId, oldPassword, newPassword) {
//   console.log("Enter editVendorStaffPassword function");
//   return await axios.put(`${vendorStaffURL}/editVendorStaffPassword/${vendorStaffId}/${oldPassword}/${newPassword}`)
//   .then((response) => {
//     console.log(response);
//     if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
//       console.log('failure in vendorStaffRedux :: editVendorStaffPassword')
//       return {status: false, data: response.data};
//     } else { // success
//       console.log("success in vendorStaffRedux :: editVendorStaffPassword");
//       return {status: true, data: response.data};
//     }
//   })
//   .catch((error) => {
//     console.error("vendorStaffRedux editVendorStaffPassword Error : ", error);
//   });
// }

// export async function getAllAssociatedVendorStaff(vendorId) {
//   console.log("Enter getAllAssociatedVendorStaff function");
//   return await axios.get(`${vendorStaffURL}/getAllAssociatedVendorStaff/${vendorId}`)
//   .then((response) => {
//     if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
//       console.log('failure in vendorStaffRedux :: getAllAssociatedVendorStaff')
//       return {status: false, data: response.data};
//     } else { // success
//       console.log("success in vendorStaffRedux :: getAllAssociatedVendorStaff");
//       return {status: true, data: response.data};
//     }
//   })
//   .catch((error) => {
//     console.error("vendorStaffRedux getAllAssociatedVendorStaff Error : ", error);
//   });
// }

// export async function toggleVendorStaffBlock(vendorStaffId) {
//   console.log("Enter toggleVendorStaffBlock function");
//   return await axios.put(`${vendorStaffURL}/toggleBlock/${vendorStaffId}`)
//   .then((response) => {
//     console.log(response);
//     if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
//       console.log('failure in vendorStaffRedux :: toggleVendorStaffBlock')
//       return {status: false, data: response.data};
//     } else { // success
//       console.log("success in vendorStaffRedux :: toggleVendorStaffBlock");
//       return {status: true, data: response.data};
//     }
//   })
//   .catch((error) => {
//     console.error("vendorStaffRedux toggleVendorStaffBlock Error : ", error);
//   });
// }