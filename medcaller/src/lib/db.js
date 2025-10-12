import { supabase } from "./supabaseClient"

export async function getPatientLocation(name) {
    const { data, error } = await supabase
        .from("patient_full_name")
        .select("patient_full_name, patient_location")
        .eq("name", name)

    if (error) throw error;
    if(!data || data.length === 0) return null;
    return data[0].location
}