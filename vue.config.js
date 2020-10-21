module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/multilevel-dynamic-menu/'
    : '/',

  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/scss/_include.scss";',
      },
    },
  },
};
