/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
      A chave `eslint` saiu: o Next 16 removeu o `next lint` e não roda mais lint durante
      o build, então `eslint.ignoreDuringBuilds` deixou de existir e só gerava o aviso
      "Invalid next.config.mjs options detected: Unrecognized key(s) in object: 'eslint'".
  */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
