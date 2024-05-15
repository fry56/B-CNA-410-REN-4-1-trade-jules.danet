import marketSingleton from "../class/market.class.js";

export default (args: string[]): string => {
    if (args[0] !== 'order')
        throw new Error('Invalid sub command format.');
    marketSingleton.timebank = parseInt(args[1]);
    const result: string | void = marketSingleton.strategy.execute(marketSingleton);
    return result ? result : 'pass';
}