import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request) {
  try {
    const { prompt } = await request.json()
    console.log('Prompt:', prompt)

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

    const response = await axios.post(
      url,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    )

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No reply'
    console.log('Gemini reply:', reply)

    return NextResponse.json({ reply }, { status: 200 })

  } catch (error) {
    console.error('API Route Error:', error)

    if (axios.isAxiosError(error)) {
      const errMsg =
        error.response?.data?.error?.message || error.message
      return NextResponse.json(
        { reply: `Error: ${errMsg}` },
        { status: error.response?.status || 500 }
      )
    }

    return NextResponse.json(
      { reply: `Error: ${error.message}` },
      { status: 500 }
    )
  }
}
