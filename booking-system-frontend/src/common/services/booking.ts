import { IBooking } from "../entity/IDBBooking";
import { IHttpResponse } from "../entity/IHttpResponse";
import { IListPage } from "../entity/IListPage";
import API from "./api";

export const SaveBooking = async (data: IBooking) => {
  try {
    const response = await API.post<IHttpResponse<IBooking | null>>('/booking/save', data)
    return response.data;
  } catch (error) {
    console.error("Create Booking error:", error);
   return null
  }
};

export const getBookings = async (params: IListPage) => {
  try {
    const response = await API.post<IHttpResponse<IBooking[] | null>>('/booking/list', params)
    return response.data
  } catch (error) {
    console.error('Fetch Bookings error:', error)
   return null
  }
}

export const getBookingById = async (id: Pick<IBooking, "id">) => {
  try {
    const response = await API.post<IHttpResponse<IBooking | null>>(`/booking/get/${id}`)
    return response.data;
  } catch (error) {
    console.error("Get Booking by ID error:", error);
   return null
  }
};

export const deleteBooking = async (id: Pick<IBooking, "id">) => {
  try {
    const response = await API.post<IHttpResponse<IBooking | null>>(`/booking/delete/${id}`)
    return response.data;
  } catch (error) {
    console.error("Delete Booking error:", error);
    return null
  }
};
