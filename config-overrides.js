/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { override, fixBabelImports, addLessLoader } = require('customize-cra')
const { getLessVars } = require('antd-theme-generator')

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css'
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: getLessVars(path.join(__dirname, './src/common/styles/vars.less')),
        strictMath: true,
        noIeCompat: true,
        localIdentName: '[local]_[hash:base64:5]'
    })
)