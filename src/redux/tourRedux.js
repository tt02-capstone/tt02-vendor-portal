import { tourApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const tourURL = "http://localhost:8080/tour";

export async function getAllTourTypesByLocal(userId) {
    try {
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
        return { status: false, data: error.message };
    }
}

export async function getTourTypeByTourTypeId(tourTypeId) {
    try {
        const response = await tourApi.get(`${tourURL}/getTourTypeByTourTypeId/${tourTypeId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getTourTypeByTourTypeId Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function updateTourType(tourType, attractionId) {
    try {
        const response = await tourApi.put(`${tourURL}/updateTourType/${attractionId}`, tourType);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux updateTourType Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getAttractionForTourTypeId(tourTypeId) {
    try {
        const response = await tourApi.get(`${tourURL}/getAttractionForTourTypeId/${tourTypeId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getAttractionForTourTypeId Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getAllToursByTourType(tourTypeId) {
    try {
        console.log(tourTypeId);
        const response = await tourApi.get(`${tourURL}/getAllToursByTourType/${tourTypeId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getAllToursByTourType Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function createTour(tourTypeId, tourObj) {
    try {
        const response = await tourApi.post(`${tourURL}/createTour/${tourTypeId}`, tourObj);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux createTour Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getTourByTourId(tourId) {
    try {
        const response = await tourApi.get(`${tourURL}/getTourByTourId/${tourId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getTourByTourId Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function deleteTour(tourId) {
    try {
        const response = await tourApi.delete(`${tourURL}/deleteTour/${tourId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux deleteTour Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function updateTour(tour) {
    try {
        console.log('gab tour', tour);
        const response = await tourApi.put(`${tourURL}/updateTour`, tour);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux updateTour Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getAllBookingsByLocal(userId) {
    try {
        const response = await tourApi.get(`${tourURL}/getAllBookingsByLocal/${userId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getAllBookingsByLocal Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getBookingByBookingId(bookingId) {
    try {
        const response = await tourApi.get(`${tourURL}/getBookingByBookingId/${bookingId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getBookingByBookingId Error : ", error);
        return { status: false, data: error.message };
    }
}