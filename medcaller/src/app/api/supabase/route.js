import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
//const supabaseUrl = 'https://eifqtvjxnvquocgzsngu.supabase.co';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req) {
    const url = new URL(req.url);
    const fileName = url.searchParams.get("file");
    const { data, error } = await supabase.storage.from('MP3').download(fileName);
    if (error) {
      console.error("Supabase Download Error:", error, fileName);
      return new Response(error.message, { status: 500 });
    }

    const arrayBuffer = await data.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg", // Important for MP3
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  }
  