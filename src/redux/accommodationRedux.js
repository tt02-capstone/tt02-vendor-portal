import { accommodationApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const accommodationURL = "http://localhost:8080/accommodation";

export async function getAccommodationListByVendor(vendorStaffId) {
  try {
    const response = await accommodationApi.get(`${accommodationURL}/getAccommodationListByVendor/${vendorStaffId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("accommodationRedux getAccommodationListByVendor Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getAccommodationByVendor(vendorStaffId, accommodationId) {
  try {
    const response = await accommodationApi.get(`${accommodationURL}/getAccommodationByVendor/${vendorStaffId}/${accommodationId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("accommodationRedux getAccommodationByVendor Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function createAccommodation(vendorStaffId, accommodation) {
  try {
    const response = await accommodationApi.post(`${accommodationURL}/createAccommodation/${vendorStaffId}`, accommodation);
    return handleApiErrors(response);
  } catch (error) {
    console.error("accommodationRedux createAccommodation Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function updateAccommodation(vendorStaffId, accommodation) {
  try {
    const response = await accommodationApi.put(`${accommodationURL}/updateAccommodation/${vendorStaffId}`, accommodation);
    return handleApiErrors(response);
  } catch (error) {
    console.error("accommodationRedux updateAccommodation Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getLastAccommodationId() {
  try {
    const response = await accommodationApi.get(`${accommodationURL}/getLastAccommodationId`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("accommodationRedux getLastAccommodationId Error: ", error);
    return { status: false, data: error.message };
  }
}

export async function createRoomListExistingAccommodation(accommodationId, roomList) {
  try {
    const response = await accommodationApi.post(`${accommodationURL}/createRoomListExistingAccommodation/${accommodationId}`, roomList);
    return handleApiErrors(response);
  } catch (error) {
    console.error("accommodationRedux createRoomListExistingAccommodation Error : ", error);
    return {status: false, data: error.message};
  }
}


export async function createRoom(accommodationId, room) {
    try {
      console.log("accommodationId", accommodationId);
      console.log("room", room);
      const response = await accommodationApi.post(`${accommodationURL}/createRoom/${accommodationId}`, room);
      return handleApiErrors(response);
    } catch (error) {
      console.error("accommodationRedux createRoom Error : ", error);
      return {status: false, data: error.message};
    }
}

export async function updateRoom(accommodationId, room) {
  try {
    console.log("accommodationId", accommodationId);
    console.log("room", room);
    const response = await accommodationApi.post(`${accommodationURL}/updateRoom/${accommodationId}`, room);
    return handleApiErrors(response);
  } catch (error) {
    console.error("accommodationRedux updateRoom Error : ", error);
    return {status: false, data: error.message};
  }
}

  export async function getRoomListByAccommodation(accommodationId) {
    try {
      const response = await accommodationApi.get(`${accommodationURL}/getRoomListByAccommodation/${accommodationId}`);
      return handleApiErrors(response);
    } catch (error) {
      console.error("accommodationRedux getRoomListByAccommodation Error: ", error);
      return { status: false, data: error.message };
    }
}

export async function getAccommodation(accommodationId) {
    try {
      const response = await accommodationApi.get(`${accommodationURL}/getAccommodation/${accommodationId}`);
      return handleApiErrors(response);
    } catch (error) {
      console.error("accommodationRedux getAccommodation Error: ", error);
      return { status: false, data: error.message };
    }
}

export async function getLastRoomId() {
  try {
    const response = await accommodationApi.get(`${accommodationURL}/getLastRoomId`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("accommodationRedux getLastRoomId Error: ", error);
    return { status: false, data: error.message };
  }
}