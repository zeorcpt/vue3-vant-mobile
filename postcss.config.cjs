const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
  plugins: [
    autoprefixer(),
    pxtorem({
      rootValue({ file }) {
        // 特别注意：如果用vant官网示例 `file.indexOf('vant')` 来匹配，请确保你的项目名或文件名没有包含'vant'
        // 建议改为 `file.indexOf('node_modules/vant')`
        return file.indexOf('node_modules/vant') !== -1 ? 37.5 : 75;
      },
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: ['.ignore', 'keep-px'],
      minPixelValue: 1,
      /**
       * 注意：这里mediaQuery仅仅设置是否转换media选择器本身的px，而不是该选择器下style的px
       * 如： @media screen and (min-width: 768px) { html: { font-size: 76.8px } }
       * mediaQuery: true => @media screen and (min-width: 10.24rem) { html: { font-size: 1.024rem } }
       * mediaQuery: false => @media screen and (min-width: 768px) { html: { font-size: 1.024rem } }
       * 解决：
       *   1. 使用'PX'忽略转换单个属性(注意prettier会将'PX'格式化为'px', 需使用'/* prettier-ignore *\/'忽略格式化)
       *   2. 使用exclude忽略整个文件
       */
      mediaQuery: false,
      // exclude: (file) => /response\.less/i.test(file),
    }),
  ],
};
