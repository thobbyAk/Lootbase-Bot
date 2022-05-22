
export default () => ({
  chainId: process.env.CHAIN_ID,
  chainName: process.env.CHAIN_NAME,
  port: parseInt(process.env.PORT, 10) || 3000,
  dispayGraph: {
    url: process.env.GRAPH_URL,
  },
  covalent: {
    url: `${process.env.COVALENT_URL}${process.env.COVALENT_CHAIN_ID}/`,
    key: process.env.COVALENT_KEY,
    chainId: process.env.CHAIN_ID,
  },
  gnosis: {
    txServiceUrl: process.env.GNOSIS_TR_SERVICE_URL,
  },
  dyspay: {
    privateKey: process.env.DYSPAY_PRIVATE_KEY,
    publicKey: process.env.DYSPAY_PUBLIC_KEY,
  },
});
