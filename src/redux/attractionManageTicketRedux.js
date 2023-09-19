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
        const response = await attractionApi.post(`/createTicketsPerDay/${start_date}/${end_date}/${ticket_type}/${ticket_count}/${attraction_id}`);
        if (response.data != []) {
            return response.data;
        }    
    } catch (error) {
        console.error("Create attraction ticket error!");
    }
}

export async function updateTicketPerDay(attraction_id,requestBody) {
    try {
        const attrTicketList = await attractionApi.put(`/updateTicketsPerDay/${attraction_id}`,requestBody)
        console.log(attrTicketList.data)
        if (attrTicketList.data.httpStatusCode = 404) {
            return {error : attrTicketList.data.errorMessage};
        }  else {
            return attrTicketList.data;
        }
    } catch (error) {
        console.error("Update attraction ticket error!");
    }
}

export async function getAllTicketListedByAttraction(attraction_id) {
    try {
        const response = await attractionApi.get(`/getAllTicketListedByAttraction/${attraction_id}`)
        if (response.data !== []) {
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
        if (response.data !== []) {
            return response.data;
        }    
    } catch (error) {
        console.error("Get attraction ticket enum attraction error!");
    }
}