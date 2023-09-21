import { vendorApi } from "./api";

export async function createVendor(values) {
  return await vendorApi.post(`/createVendor`, {
    name: values.poc_name,
    email: values.email,
    password: values.password,
    is_blocked: false,
    is_master_account: true,
    position: values.poc_position,
    user_type: 'VENDOR_STAFF',
    email_verified: false,
    vendor: {
      business_name: values.business_name,
      poc_name: values.poc_name,
      poc_position: values.poc_position,
      country_code: values.country_code,
      poc_mobile_num: values.poc_mobile_num,
      wallet_balance: 0,
      application_status: 'PENDING',
      vendor_type: values.vendor_type,
      service_description: values.service_description
    }
  })
    .then((response) => {
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) { 
        return { status: false, data: response.data };
      } else {
        return { status: true, data: response.data };
      }
    })
    .catch((error) => {
      console.error("VendorRedux vendorURL Error : ", error);
    });
}