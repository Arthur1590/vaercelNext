import prisma from '@/utils/prisma/client'
import createClient from '@/utils/supabase/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {
        const supabase = createClient(req, res)
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
            res.status(401)
            return
        }

        const profile = await prisma.profiles.findUnique({ where: { id: user!.id } })
        if (!profile || profile.role != 'admin') {
            res.status(403).end()
            return
        }

        const config = await prisma.config.findUnique({ where: { id: 1 } })

        let specials = ''
        for (const s of config!.specials) {
            specials += `${s}\n`
        }
        specials = specials.trim()

        res.setHeader('Content-Disposition', 'attachment; filename="usernames.txt"')
        res.setHeader('Content-Type', 'application/octet-stream')
        res.send(specials)
    }
}
