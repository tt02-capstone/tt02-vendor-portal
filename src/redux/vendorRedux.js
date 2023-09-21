import { vendorApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function createVendor(values) {

  try {
    const response = await vendorApi.post(`/createVendor`, {
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
    });
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorRedux createVendor Error : ", error);
    return {status: false, data: error.message};
  }
}