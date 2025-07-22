import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request) {
  try {
    const { prompt } = await request.json()
    console.log('Prompt:', prompt)
    console.log('API key:', process.env.GEMINI_API_KEY ? 'Exists' : 'Missing!')

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables')
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    console.log('Gemini response:', response.data)
    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply'
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('API Route Error:', error.response?.data || error.message)
    return NextResponse.json(
      { reply: `Error: ${error.response?.data?.error?.message || error.message}` },
      { status: 500 }
    )
  }
}
