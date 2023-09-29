import { NextRequest, NextResponse } from 'next/server'
import { getRedirectsByEmail } from '../../../lib/database'

export async function GET(req:NextRequest, res:NextResponse) {
    const { email } = await req.json()
    const events = getRedirectsByEmail(email)
    return NextResponse.json({
        events
    })
}