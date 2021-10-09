import { applySession } from 'next-iron-session'
import { URLSearchParams } from 'url'
import { API_URL, COOKIE_NAME, SESSION_PASSWORD } from '../../../utils/const'

export default async function handler(req, res) {
    try {
        const signedUser = req.body
        await applySession(req, res, {
            password: SESSION_PASSWORD,
            cookieName: COOKIE_NAME,
        })
        req.session.set('user', signedUser)
        await req.session.save()
        res.status(200).json({
            success: true,
            signedUser: req.session.user,
        })
    } catch (err) {
        console.log(err)
        res.status(403).json({
            error: 'server exception',
            errorText: JSON.stringify(err),
        })
    }
}
