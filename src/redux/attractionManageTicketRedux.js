import { attractionApi } from "./api";

export async function getAttractionList(vendor_id) {
    try {
        const response = await attractionApi.get(`/getAttractionListByVendor/${vendor_id}`)
        if (response.data != []) {
            return response.data;
        }    
    } catch (error) {
        console.error("Retrieve vendor attraction list error!");
    }
}

export async function createTickets(start_date,end_date,ticket_type,ticket_count,attraction_id) {
    try {
        const response = await attractionApi.post(`/createTicketsPerDay/${start_date}/${end_date}/${ticket_type}/${ticket_count}/${attraction_id}`)
        if (response.data != []) {
            return response.data;
        }    
    } catch (error) {
        console.error("Update ticket per day error!");
    }
}

export async function updateTicketPerDay(attraction_id) {
    try {
        const response = await attractionApi.put(`/updateTicketsPerDay/${attraction_id}`)
        if (response.data != []) {
            return response.data;
        }    
    } catch (error) {
        console.error("Update ticker per day error!");
    }
}

export async function getAllTicketListedByAttraction(attraction_id) {
    try {
        const response = await attractionApi.get(`/getAllTicketListedByAttraction/${attraction_id}`)
        if (response.data != []) {
            return response.data;
        }    
    } catch (error) {
        console.error("Get all tickets associated with attraction error!");
    }
}

// fetch the ticket types tied to each attraction so user can only select what they have
export async function getTicketEnumByAttraction(attraction_id) {
    try {
        const response = await attractionApi.get(`/getTicketEnumByAttraction/${attraction_id}`)
        if (response.data != []) {
            return response.data;
        }    
    } catch (error) {
        console.error("Get attraction ticket enum attraction error!");
    }
}