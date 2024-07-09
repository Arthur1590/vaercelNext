import prisma from '@/utils/prisma/client'
import createClient from '@/utils/supabase/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const supabase = createClient(req, res)
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
            res.status(401).end()
            return
        }

        const { chests }: { chests: number } = req.body

        const profile = await prisma.profiles.update({ where: { id: user.id }, data: { chests } })

        res.status(200).json({ profile })
    }
}
