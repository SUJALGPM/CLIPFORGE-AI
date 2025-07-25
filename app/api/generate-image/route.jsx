// 1.Code which generated images and give direct url...

// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';
// import OpenAI from 'openai'; 

// const client = new OpenAI({
//   baseURL: 'https://api.studio.nebius.com/v1/',
//   apiKey: process.env.NEXT_PUBLIC_NEBIUS_API_KEY, 
// });

// export async function POST(req) {
//   try {
//     const { prompt } = await req.json();

//     const response = await client.images.generate({
//       model: 'black-forest-labs/flux-schnell',
//       prompt,
//       width: 1024,
//       height: 1024,
//       response_format: 'b64_json',
//       response_extension: 'png',
//       num_inference_steps: 4,
//       negative_prompt: '',
//       seed: -1,
//       loras: null,
//     });

//     const base64Image = response.data[0].b64_json;
//     const buffer = Buffer.from(base64Image, 'base64');

//     const dir = path.join(process.cwd(), 'public', 'generated');
//     const filename = `image-${Date.now()}.png`;
//     const filepath = path.join(dir, filename);

//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     fs.writeFileSync(filepath, buffer);

//     return NextResponse.json({ success: true, url: `/generated/${filename}` });

//   } catch (error) {
//     console.error('Error generating/saving image:', error.response?.data || error.message);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }


// 2. Code which generated images --> store in supabase --> then give url...
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Nebius client
const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEXT_PUBLIC_NEBIUS_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // 1. Generate image
    const response = await client.images.generate({
      model: 'black-forest-labs/flux-schnell',
      prompt,
      width: 1024,
      height: 1024,
      response_format: 'b64_json',
      response_extension: 'png',
      num_inference_steps: 4,
      negative_prompt: '',
      seed: -1,
      loras: null,
    });

    const base64Image = response.data[0].b64_json;
    const buffer = Buffer.from(base64Image, 'base64');

    // 2. Save temporarily (optional but helpful for debugging)
    const tempDir = path.join(process.cwd(), 'public', 'generated');
    const filename = `image-${Date.now()}.png`;
    const filepath = path.join(tempDir, filename);

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(filepath, buffer); 

    // 3. Upload to Supabase
    const { data, error } = await supabase.storage
      .from('frozen') 
      .upload(filename, buffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error('Supabase image upload error:', error);
      return NextResponse.json({ success: false, error: 'Supabase upload failed' }, { status: 500 });
    }

    // 4. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('frozen')
      .getPublicUrl(filename);

    const imageUrl = publicUrlData?.publicUrl;

    return NextResponse.json({ success: true, imageUrl });

  } catch (error) {
    console.error('Error generating/saving/uploading image:', error.response?.data || error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

