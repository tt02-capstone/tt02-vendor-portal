import axios from "axios";

const vendorStaffURL = "http://localhost:8080/vendorStaff";

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