import {utils, BigNumber} from 'ethers'


export const shortenAddress = (address: string) => {
    if (!address) return "";
    if (address.startsWith("0x")) {
      if (address.length < 12) return address;
      return address.slice(0, 6) + "..." + address.slice(-4);
    }
    if (address.length < 10) return address;
    return address.slice(0, 4) + "..." + address.slice(-4);
  };
  export const toTimestamp = (strDate: any) => {
    var datum = Date.parse(strDate); return datum/1000;
  }


  export const weiConverter = (weiValue: any) => {
    const balance = BigNumber.from(parseInt(weiValue));
    const remainder = balance.mod(1e14);
    return utils.formatEther(balance.sub(remainder))
  }