import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {

      const { data, error } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('role', 'user');

      if (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ users: data });
    } catch (error) {
      console.error('Error in API:', error);
      return res.status(500).json({ error });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
