import { userApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";


export async function uploadNewProfilePic(user) {
  try {
    const response = await userApi.put(`/uploadNewProfilePic`, user);
    return handleApiErrors(response);
  } catch (error) {
    console.error("userRedux uploadNewProfilePic Error : ", error);
    return error.message;
  }
}

export async function editPassword(userId, oldPassword, newPassword) {
  try {
    const response = await userApi.put(`/editPassword/${userId}/${oldPassword}/${newPassword}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("userRedux editPassword Error : ", error);
    return error.message;
  }
}

export async function passwordResetStageOne(email) {
  try {
    const response = await userApi.post(`/webPasswordResetStageOne/${email}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("userRedux passwordResetStageOne Error : ", error);
    return error.message;
  }
}

export async function passwordResetStageTwo(email, otp) {
  try {
    const response = await userApi.post(`/webPasswordResetStageTwo/${email}/${otp}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("userRedux passwordResetStageTwo Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function passwordResetStageThree(email, password) {
  try {
    const response = await userApi.post(`/webPasswordResetStageThree/${email}/${password}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("userRedux passwordResetStageThree Error : ", error);
    return {status: false, data: error.message};
  }
}