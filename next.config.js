import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@':       path.resolve(process.cwd(), 'src'),
      '@common': path.resolve(process.cwd(), '../common/src'),
      '@lambda': path.resolve(process.cwd(), '../lambda/functions'),
    }
    return config
  },
}
export default nextConfig