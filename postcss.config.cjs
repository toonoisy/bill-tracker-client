// CommonJS files need to be explicitly named as .cjs
module.exports = {
  "plugins": [
    // require("autoprefixer"),
    require("postcss-pxtorem")({
      rootValue: 37.5,
      propList: ['*'],
      selectorBlackList: ['.norem'],
    })
  ]
}
