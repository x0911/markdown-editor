module.exports = {
  productionSourceMap: false,
  runtimeCompiler: true,
  transpileDependencies: ["vuetify"],
  pwa: {
    workboxOptions: {
      skipWaiting: true,
    },
  },
  devServer: {
    host: "localhost",
  },
};
