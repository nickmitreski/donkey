/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ELEVEN_LABS_API_KEY: 'sk_e80790bdb131b47d5156cef9321178591a2541eb1cf17e62',
    NEXT_PUBLIC_AGENT_ID: '21TM2Yp7xrwKmKSY8wBJ'
  },
  experimental: {
    serverActions: true
  }
}

export default nextConfig
