const config = () => {
  if (!process.env.vidly_jwtPrivateKey)
    throw new Error("FATAL ERROR: private key is not defined");
};
export default config;
