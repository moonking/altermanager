// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "plugin:vue/essential",
    "eslint:recommended",
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    "standard"
  ],
  // required to lint *.vue files
  plugins: ["vue"],
  // add your custom rules here
  rules: {
    // allow async-await
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    //语句强制分号结尾
    "semi": ["off", "always"],
    //
    "space-before-function-paren":"off",
    //强制使用===
    "eqeqeq": "off",
    //文字间的空格和tabs
    "no-tabs": "off",
    //禁止混用tab和空格
    "no-mixed-spaces-and-tabs": ["off", false],
    //禁止在使用new构造一个实例后不赋值
    "no-new": "off",
    //不允许在字符串和正则表达式中使用无意义的换行符
    "no-useless-escape": "off",
    //禁止使用console 
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    //空块语句不能为空
    "no-empty": "error",
    //连续声明
    "one-var": "off",
    //禁止在计算属性中对属性修改
    "vue/no-side-effects-in-computed-properties": "off",
    //禁止未使用的表达式
    "vue/no-parsing-error": "off"
  }
};
