import axios from "axios";

const vendorStaffURL = "http://localhost:8080/vendorStaff";

export async function verifyEmail(token) {
    return await axios.get(`${vendorStaffURL}/verifyEmail/${token}`)
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