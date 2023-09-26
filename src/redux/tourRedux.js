import { tourApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const tourURL = "http://localhost:8080/tour";

export async function getAllTourTypesByLocal(userId) {
    try {
        console.log('GAB');
        const response = await tourApi.get(`${tourURL}/getAllTourTypesByLocal/${userId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getAllTourTypesByLocal Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getLastTourTypeId() {
    try {
        const response = await tourApi.get(`${tourURL}/getLastTourTypeId`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getLastTourTypeId Error: ", error);
        return { status: false, data: error.message };
    }
}

export async function createTourType(userId, attractionId, tourType) {
    try {
      const response = await tourApi.post(`${tourURL}/createTourType/${userId}/${attractionId}`, tourType);
      return handleApiErrors(response);
    } catch (error) {
      console.error("tourRedux createTourType Error : ", error);
      return {status: false, data: error.message};
    }
  }