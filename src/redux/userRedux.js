import axios from "axios";

const userURL = "http://localhost:8080/user";

export async function passwordResetStageOne(email) {
    return await axios.post(`${userURL}/webPasswordResetStageOne/${email}`)
        .then((response) => {
            if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) {
                return { status: false, data: response.data };
            } else {
                return { status: true, data: response.data };
            }
        })
        .catch((error) => {
            console.error("VendorStaffRedux webPasswordResetStageOne Error : ", error);
        });
}

export async function passwordResetStageTwo(email, otp) {
    return await axios.post(`${userURL}/webPasswordResetStageTwo/${email}/${otp}`)
        .then((response) => {
            if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) {
                return { status: false, data: response.data };
            } else {
                return { status: true, data: response.data };
            }
        })
        .catch((error) => {
            console.error("VendorStaffRedux webPasswordResetStageTwo Error : ", error);
        });
}

export async function passwordResetStageThree(email, password) {
    return await axios.post(`${userURL}/webPasswordResetStageThree/${email}/${password}`)
        .then((response) => {
            if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) {
                return { status: false, data: response.data };
            } else {
                return { status: true, data: response.data };
            }
        })
        .catch((error) => {
            console.error("VendorStaffRedux webPasswordResetStageThree Error : ", error);
        });
}