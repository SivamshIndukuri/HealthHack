import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
//const supabaseUrl = 'https://eifqtvjxnvquocgzsngu.supabase.co';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req) {
    const filePaths = {
        "Aetna": "Aetna.mp3",
        "Cigna": "Cigna.mp3",
        "United": "UnitedHealthcare.mp3",
        "Blue Cross": "Blue Cross Blue Shield.mp3"
    }
    const { data, error } = await supabase.storage.from('mp3').download(filePaths.Aetna);
  
    if (error) {
      return new Response(error.message, { status: 500 });
    }
  
    const arrayBuffer = await data.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg", // Important for MP3
        //"Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  }
  