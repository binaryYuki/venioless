/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')


const nextConfig = {
  reactStrictMode: true,
  i18n,
  transpilePackages: [ "antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table" ],
}

module.exports = nextConfig
