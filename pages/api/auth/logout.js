import { applySession } from 'next-iron-session'
import { COOKIE_NAME, SESSION_PASSWORD } from '../../../utils/const'

export default async function handler(req, res) {
    await applySession(req, res, {
        password: SESSION_PASSWORD,
        cookieName: COOKIE_NAME,
    })
    req.session.unset('user')
    await req.session.save()
    res.status(200).end()
}
