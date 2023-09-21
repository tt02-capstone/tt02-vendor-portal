import { localApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function editLocalProfile(editedProfile) {

  try {
    const response = await localApi.put(`/editLocalProfile`, editedProfile);
    return handleApiErrors(response);
  } catch (error) {
    console.error("localRedux editLocalProfile Error : ", error);
    // response.message.error
  }
}