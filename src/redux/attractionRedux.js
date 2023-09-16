import axios from "axios";

const attractionURL = "http://localhost:8080/attraction";
const imgurURL = "https://api.imgur.com/3";

export async function getAttractionListByVendor(vendorStaffId) {
  return await axios.get(`${attractionURL}/getAttractionListByVendor/${vendorStaffId}`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
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
  return await axios.get(`${attractionURL}/getAttractionByVendor/${vendorStaffId}/${attractionId}`)
  .then((response) => {
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
  return await axios.post(`${attractionURL}/createAttraction/${vendorStaffId}`, attraction)
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
  return await axios.put(`${attractionURL}/updateAttraction/${vendorStaffId}`, attraction)
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

export async function uploadImageToImgur(image) {
  return await axios.post(`https://api.imgur.com/3/image`, image)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      return {status: false, data: response.data};
    } else { // success
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("attractionRedux uploadImageToImgur Error : ", error);
  });
}