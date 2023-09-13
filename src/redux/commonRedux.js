import axios from "axios";

const userURL = "http://localhost:8080/user";

export async function vendorPortalLogin(email, password) {
  console.log("Enter vendorPortalLogin function");
  return await axios.put(`${userURL}/vendorPortalLogin/${email}/${password}`)
  .then((response) => {
    console.log(response);
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422 || response.data.httpStatusCode === 404) { // error
      console.log('failure in loginAndPasswordRedux :: vendorPortalLogin');
      return {status: false, data: response.data};
    } else { // success
      console.log("success in loginAndPasswordRedux :: vendorPortalLogin");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("loginAndPasswordRedux vendorPortalLogin Error : ", error);
  });
}

export async function getUserProfile(userId) {
  console.log("Enter getUserProfile function");
  return await axios.get(`${userURL}/getUserProfile/${userId}`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in commonRedux :: getUserProfile')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in commonRedux :: getUserProfile");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("commonRedux getUserProfile Error : ", error);
  });
}

// export async function editUserProfile(editedUserProfile) {
//   console.log("Enter editUserProfile function");
//   return await axios.put(`${userURL}/editUserProfile`, editedUserProfile)
//   .then((response) => {
//     console.log(response);
//     if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
//       console.log('failure in commonRedux :: editUserProfile :: vendor')
//       return {status: false, data: response.data};
//     } else { // success
//       console.log("success in commonRedux :: editUserProfile :: vendor");
//       return {status: true, data: response.data};
//     }
//   })
//   .catch((error) => {
//     console.error("commonRedux editUserProfile :: Vendor Error : ", error);
//   });
// }

// export async function editUserPassword(userId, oldPassword, newPassword) {
//   console.log("Enter editUserPassword function");
//   return await axios.put(`${userURL}/editUserPassword/${userId}/${oldPassword}/${newPassword}`)
//   .then((response) => {
//     console.log(response);
//     if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
//       console.log('failure in loginAndPasswordRedux :: editUserPassword')
//       return {status: false, data: response.data};
//     } else { // success
//       console.log("success in loginAndPasswordRedux :: editUserPassword");
//       return {status: true, data: response.data};
//     }
//   })
//   .catch((error) => {
//     console.error("loginAndPasswordRedux editUserPassword Error : ", error);
//   });
// }