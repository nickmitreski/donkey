export async function GET() {
  return Response.json({
    hasApiKey: !!process.env.ELEVEN_LABS_API_KEY,
    hasAgentId: !!process.env.NEXT_PUBLIC_AGENT_ID,
    apiKeyLength: process.env.ELEVEN_LABS_API_KEY?.length,
    agentIdLength: process.env.NEXT_PUBLIC_AGENT_ID?.length,
  })
} 