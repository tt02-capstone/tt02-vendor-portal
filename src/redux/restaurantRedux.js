import { restaurantApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const restURL = "http://localhost:8080/restaurant";

export async function getAllRestaurantByVendor(userId) {
    try {
        const response = await restaurantApi.get(`${restURL}/getAllRestaurantByVendor/${userId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("restaurantRedux getAllRestaurantByVendor Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getRestaurant(restId) {
    try {
        const response = await restaurantApi.get(`${restURL}/getRestaurant/${restId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("restaurantRedux getRestaurant Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getRestaurantDish(restId) { // get all the dish belonging to the restaurant 
    try {
        const response = await restaurantApi.get(`${restURL}/getRestaurantDish/${restId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("restaurantRedux getRestaurantDish Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function createRestaurant(userId, restaurant) {
    try {
      const response = await restaurantApi.post(`${restURL}/createRestaurant/${userId}`, restaurant);
      return handleApiErrors(response);
    } catch (error) {
      console.error("restaurantRedux createRestaurant Error : ", error);
      return {status: false, data: error.message};
    }
}

export async function updateRestaurant(restaurant) {
    try {
      const response = await restaurantApi.put(`${restURL}/updateRestaurant`, restaurant);
      return handleApiErrors(response);
    } catch (error) {
      console.error("restaurantRedux updateRestaurant Error : ", error);
      return {status: false, data: error.message};
    }
}

export async function addDish(restId, newDish) {
    try {
      const response = await restaurantApi.post(`${restURL}/addDish/${restId}`, newDish);
      return handleApiErrors(response);
    } catch (error) {
      console.error("restaurantRedux addDish Error : ", error);
      return {status: false, data: error.message};
    }
}

export async function updateDish(restId, updateDish) {
    try {
      const response = await restaurantApi.put(`${restURL}/updateDish/${restId}`, updateDish);
      return handleApiErrors(response);
    } catch (error) {
      console.error("restaurantRedux updateDish Error : ", error);
      return {status: false, data: error.message};
    }
}

export async function deleteDish(restId, dishId) {
    try {
      const response = await restaurantApi.delete(`${restURL}/deleteDish/${restId}/${dishId}`);
      return handleApiErrors(response);
    } catch (error) {
      console.error("restaurantRedux deleteDish Error : ", error);
      return {status: false, data: error.message};
    }
}

export async function getLastRestId() {
  try {
    const response = await restaurantApi.get(`${restURL}/getLastRestId`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("restaurantRedux getLastRestId Error: ", error);
    return { status: false, data: error.message };
  }
}