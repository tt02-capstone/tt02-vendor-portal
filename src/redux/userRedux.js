import axios from "axios";
import { userApi } from "./api";

export async function uploadNewProfilePic(user) {
    console.log("Enter uploadNewProfilePic function");
    return await userApi.put(`/uploadNewProfilePic`, user)
    .then((response) => {
      console.log(response);
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
        console.log('failure in userRedux :: uploadNewProfilePic')
        return {status: false, data: response.data};
      } else { // success
        console.log("success in userRedux :: uploadNewProfilePic");
        return {status: true, data: response.data};
      }
    })
    .catch((error) => {
      console.error("userRedux uploadNewProfilePic Error : ", error);
    });
}

export async function editPassword(userId, oldPassword, newPassword) {
  console.log("Enter editUserPassword function");
  return await userApi.put(`/editPassword/${userId}/${oldPassword}/${newPassword}`)
  .then((response) => {
    console.log(response);
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in userRedux :: editPassword')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in userRedux :: editPassword");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("userRedux editPassword Error : ", error);
  });
}

export async function passwordResetStageOne(email) {
    return await userApi.post(`/webPasswordResetStageOne/${email}`)
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
    return await userApi.post(`/webPasswordResetStageTwo/${email}/${otp}`)
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
    return await userApi.post(`$/webPasswordResetStageThree/${email}/${password}`)
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