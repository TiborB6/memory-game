const importAll = (requireContext) => requireContext.keys().map(requireContext);

const Images = importAll(require.context('./game-img', false, /\.(png|jpe?g|svg|webp)$/));

export default Images;
