import { createClient, VercelKV } from '@vercel/kv';
let kv: VercelKV;

export default function kvClient(): VercelKV {
  if (!kv) {
    kv = createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  return kv;
}
