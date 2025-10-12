import { supabase } from "./supabaseClient"

export async function getPatientLocation(name) {
    const { data, error } = await supabase
        .from("patientdata")
        .select("patient_full_name, patient_location")
        .ilike("patient_full_name", `%${name}%`)

    if (error) throw error;
    if(!data || data.length === 0) return null;
    return data[0].patient_location
}