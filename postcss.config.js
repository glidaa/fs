module.exports = (ctx) => ({
  parser: "postcss-scss",
  map: false,
  plugins: {
    autoprefixer: ctx.env === "production" ? true : false,
    "css-declaration-sorter":
      ctx.env !== "production" ? { order: "smacss" } : false,
  },
});
