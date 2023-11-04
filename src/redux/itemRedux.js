import { itemApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function createItem(vendorId, itemToCreate) {
    try {
        const response = await itemApi.post(`/createItem/${vendorId}`, itemToCreate);
        return handleApiErrors(response);
    } catch (error) {
        console.error("itemRedux createItem Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function updateItem(itemToUpdate) {
    try {
        const response = await itemApi.put(`/updateItem`, itemToUpdate);
        return handleApiErrors(response);
    } catch (error) {
        console.error("itemRedux updateItem Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function deleteItem(vendorId, itemIdToDelete) {
    try {
        const response = await itemApi.delete(`/deleteItem/${vendorId}/${itemIdToDelete}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("itemRedux deleteItem Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function retrieveAllItemsByVendor(vendorId) {
    try {
        const response = await itemApi.get(`/retrieveAllItemsByVendor/${vendorId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("itemRedux retrieveAllItemsByVendor Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getLastItemId() {
    try {
      const response = await itemApi.get(`/getLastItemId`);
      return handleApiErrors(response);
    } catch (error) {
      console.error("itemRedux getLastItemId Error: ", error);
      return { status: false, data: error.message };
    }
  }