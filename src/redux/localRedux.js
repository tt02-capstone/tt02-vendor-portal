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