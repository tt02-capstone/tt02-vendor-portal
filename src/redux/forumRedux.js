import { categoryApi, categoryItemApi, postApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function createCategoryItem(categoryId, categoryItemToCreate) {
    try {
        const response = await categoryItemApi.post(`/createCategoryItem/${categoryId}`, categoryItemToCreate);
        console.log(response);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux createCategoryItem Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function updateCategoryItem(categoryItemToUpdate) {
    try {
        const response = await categoryItemApi.put(`/updateCategoryItem`, categoryItemToUpdate);
        console.log(response);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux updateCategoryItem Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function deleteCategoryItem(categoryItemIdToDelete) {
    try {
        const response = await categoryItemApi.delete(`/deleteCategoryItem/${categoryItemIdToDelete}`);
        console.log(response);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux deleteCategoryItem Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function createPost(userId, categoryItemId, postToCreate) {
    try {
        const response = await postApi.post(`/createPost/${userId}/${categoryItemId}`, postToCreate);
        console.log(response);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux createPost Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function updatePost(postToUpdate) {
    try {
        const response = await postApi.put(`/updatePost`, postToUpdate);
        console.log(response);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux updatePost Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function deletePost(postIdToDelete) {
    try {
        const response = await postApi.delete(`/deletePost/${postIdToDelete}`);
        console.log(response);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux deletePost Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getAllCategory() {
    try {
        const response = await categoryApi.get(`/getAll`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux getAllCategory Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getAllByCategoryItems(categoryId) {
    try {
        const response = await categoryItemApi.get(`/getAllByCategoryId/${categoryId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux getAllByCategoryItems Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getAllPostByCategoryItemId(categoryItemId) {
    try {
        const response = await postApi.get(`/getAllPostByCategoryItemId/${categoryItemId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux getAllPostByCategoryItemId Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getPost(postId) {
    try {
        const response = await postApi.get(`/getPost/${postId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("forumRedux getPost Error : ", error);
        return { status: false, data: error.message };
    }
}