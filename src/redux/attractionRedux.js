import { attractionApi } from "./api";

const attractionURL = "http://localhost:8080/attraction";

export async function getAttractionListByVendor(vendorStaffId) {
  return await attractionApi.get(`${attractionURL}/getAttractionListByVendor/${vendorStaffId}`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) { // error
      return {status: false, data: response.data};
    } else { // success
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("attractionRedux getAttractionListByVendor Error : ", error);
  });
}

export async function getAttractionByVendor(vendorStaffId, attractionId) {
  console.log("vendorStaffId:",vendorStaffId, " attractionId:",  attractionId)
  return await attractionApi.get(`${attractionURL}/getAttractionByVendor/${vendorStaffId}/${attractionId}`)
  .then((response) => {
    console.log(response.data)
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      return {status: false, data: response.data};
    } else { // success
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("attractionRedux getAttractionByVendor Error : ", error);
  });
}

export async function createAttraction(vendorStaffId,attraction) {
  return await attractionApi.post(`${attractionURL}/createAttraction/${vendorStaffId}`, attraction)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      return {status: false, data: response.data};
    } else { // success
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("attractionRedux createAttraction Error : ", error);
  });
}

export async function updateAttraction(vendorStaffId, attraction) {
  return await attractionApi.put(`${attractionURL}/updateAttraction/${vendorStaffId}`, attraction)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      return {status: false, data: response.data};
    } else { // success
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("attractionRedux updateAttraction Error : ", error);
  });
}