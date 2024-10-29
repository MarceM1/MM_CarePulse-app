'use server'

import { ID } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointmen = async (appointment: CreateAppointmentParams)=>{
    
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            {
              ...appointment,
            }
          );
          return parseStringify(newAppointment);
    } catch (error) {
      console.log("Error in rcreateAppointment: ", error);
    }
  }