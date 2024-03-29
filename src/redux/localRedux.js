import { localApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function editLocalProfile(editedProfile) {

  try {
    const response = await localApi.put(`/editLocalProfile`, editedProfile);
    return handleApiErrors(response);
  } catch (error) {
    console.error("localRedux editLocalProfile Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getLocalWalletHistory(localId) {

  try {
    const response = await localApi.get(`/getWalletHistory/${localId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("local Redux Error : ", error);
    return {status: false, data: error.message};
  }
  
}