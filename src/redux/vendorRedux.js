import axios from "axios";

const vendorURL = "http://localhost:8080/vendor";

export async function createVendor(vendor) {
    console.log(vendor);
    await axios.post(`${vendorURL}/createVendor`, vendor)
    .then((response) => {
      if (response.data.httpStatusCode === 400) { // error
          console.log('fail')
        return false;
      } else { // success
        console.log("success in vendorRedux");
        return true;
      }
    })
    .catch((error) => {
      console.error("VendorRedux createVendor Error : ", error);
    });
}