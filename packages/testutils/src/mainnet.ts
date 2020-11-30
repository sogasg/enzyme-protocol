export type MainnetConfig = typeof mainnet;

export const mainnet = {
  chaiPriceSource: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
  chainlinkEthUsdAggregator: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  // All Chainlink aggregator addresses should be the proxy contracts
  chainlinkAggregators: {
    bat: ['0x0d16d4528239e9ee52fa531af613AcdB23D88c94', 0],
    bnb: ['0x14e613AC84a31f709eadbdF89C6CC390fDc9540A', 1],
    bnt: ['0xCf61d1841B178fe82C8895fe60c2EDDa08314416', 0],
    comp: ['0x1B39Ee86Ec5979ba5C322b826B3ECb8C79991699', 0],
    dai: ['0x773616E4d11A78F511299002da57A0a94577F1f4', 0],
    knc: ['0x656c0544eF4C98A6a98491833A89204Abb045d6b', 0],
    link: ['0xDC530D9457755926550b59e8ECcdaE7624181557', 0],
    mana: ['0x82A44D92D6c329826dc557c5E1Be6ebeC5D5FeB9', 0],
    mln: ['0xDaeA8386611A157B08829ED4997A8A62B557014C', 0],
    rep: ['0xD4CE430C3b67b3E2F7026D86E7128588629e2455', 0],
    ren: ['0x0f59666EDE214281e956cb3b2D0d69415AfF4A01', 1],
    uni: ['0xD6aA3D25116d8dA79Ea0246c4826EB951872e02e', 0],
    usdc: ['0x986b5E1e1755e3C2440e960477f25201B0a8bbD4', 0],
    usdt: ['0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46', 0],
    zrx: ['0x2Da4983a622a8498bb1a21FaE9D8F6C664939962', 0],
    susd: ['0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757', 0],
  },
  comptroller: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
  derivatives: {
    chai: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    compound: {
      cbat: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
      ccomp: '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4',
      cdai: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
      ceth: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
      crep: '0x158079ee67fce2f58472a96584a73c7ab9ac95c1',
      cuni: '0x35A18000230DA775CAc24873d00Ff85BccdeD550',
      cusdc: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
      czrx: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
    },
    synthetix: {
      sbtc: '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
    },
    uniswapV2: {
      mlnWeth: '0x15ab0333985FD1E289adF4fBBe19261454776642',
      kncWeth: '0xf49C43Ae0fAf37217bDcB00DF478cF793eDd6687',
    },
  },
  kyber: '0x9AAb3f75489902f3a48495025729a0AF77d4b11e',
  maker: {
    pot: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
    dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  paraswap: {
    augustusSwapper: '0x9509665d015Bfe3C77AA5ad6Ca20C8Afa1d98989',
    tokenTransferProxy: '0x0A87c89B5007ff406Ab5280aBdD80fC495ec238e',
  },
  synthetix: {
    addressResolver: '0x61166014E3f04E40C953fe4EAb9D9E40863C83AE',
    delegateApprovals: '0x15fd6e554874B9e70F832Ed37f231Ac5E142362f',
    exchanger: '0xc4942df0d3c561c71417BBA09d2DEA7a3CC676Fb',
    snx: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
  },
  tokens: {
    bat: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    bnb: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    bnt: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
    comp: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    knc: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
    link: '0x514910771af9ca656af840dff83e8264ecf986ca',
    mana: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    mln: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892',
    rep: '0x1985365e9f78359a9b6ad760e32412f4a445e862',
    ren: '0x408e41876cccdc0f92210600ef50372656052a38',
    uni: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    zrx: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    susd: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
  },
  whales: {
    bat: '0x312da0eae223b2062ecd4d3f3a1100eb7d4414b1',
    bnb: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
    bnt: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
    comp: '0xC89b6f0146642688bb254bF93C28fcCF1E182C81',
    dai: '0x16B34Ce9A6a6F7FC2DD25Ba59bf7308E7B38E186',
    knc: '0x986C98AF08AdBB82A8De7c7E88c6e8e4C74105ae',
    link: '0xbe6977e08d4479c0a6777539ae0e8fa27be4e9d6',
    mana: '0xefb94ac00f1cee8a89d5c3f49faa799da6f03024',
    mln: '0xd8f8a53945bcfbbc19da162aa405e662ef71c40d',
    rep: '0x43984d578803891dfa9706bdeee6078d80cfc79e',
    ren: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
    uni: '0x9f41cecc435101045ea9f41d4ee8c5353f77e5d5',
    usdc: '0x8cee3eeab46774c1cde4f6368e3ae68bccd760bf',
    usdt: '0x5041ed759dd4afc3a72b8192c143f72f4724081a',
    weth: '0xe08A8b19e5722a201EaF20A6BC595eF655397bd5',
    zrx: '0x206376e8940e42538781cd94ef024df3c1e0fd43',
    cbat: '0x285306442cd985cab2c30515cfdab106fca7bc44',
    ccomp: '0xd74f186194ab9219fafac5c2fe4b3270169666db',
    cdai: '0x554bd2947df1c8d8d38897bdc92b3b97692b2845',
    ceth: '0x5cfd0cddf989959a6a6c3ad985ce324460d46dfd',
    crep: '0xc2386de1b7271a87b416f4605d500846e826a185',
    cuni: '0xdf63be2e473ba04c26b1609e51d08cf0d78e0913',
    cusdc: '0x84c35f982496982b916f15d21026bc8d1d3cbc59',
    czrx: '0xe94543ffb8689cf04af9aad6c0e28099c384505f',
    susd: '0x49BE88F0fcC3A8393a59d3688480d7D253C37D2A',
  },
  uniswapV2: {
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  },
  zeroExV2: {
    exchange: '0x080bf510fcbf18b91105470639e9561022937712',
    erc20Proxy: '0x95e6f48254609a6ee006f7d493c8e5fb97094cef',
  },
};
