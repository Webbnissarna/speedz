module.exports = {
  plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx", "@svgr/plugin-prettier"],
  typescript: true,
  replaceAttrValues: {
    "#000000": "currentColor",
  },
};
