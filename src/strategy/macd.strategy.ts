import { Strategy } from "../interface/strategy.interface.js";
import { Market } from "../class/market.class.js";
import { Order, OrderType } from "../class/order.class.js";
import { Currency } from "../class/currency.class.js";

export class MacdStrategy implements Strategy {
    private readonly shortPeriod: number;
    private readonly longPeriod: number;
    private readonly signalPeriod: number;

    constructor(shortPeriod: number, longPeriod: number, signalPeriod: number) {
        this.shortPeriod = shortPeriod;
        this.longPeriod = longPeriod;
        this.signalPeriod = signalPeriod;
    }

    private calculateEMA(prices: number[], period: number): number[] {
        const k = 2 / (period + 1);
        let emaArray: number[] = [];
        emaArray[0] = prices[0];

        for (let i = 1; i < prices.length; i++) {
            emaArray[i] = prices[i] * k + emaArray[i - 1] * (1 - k);
        }

        return emaArray;
    }

    private calculateMACD(prices: number[]): { macdLine: number[], signalLine: number[] } {
        const shortEMA = this.calculateEMA(prices, this.shortPeriod);
        const longEMA = this.calculateEMA(prices, this.longPeriod);
        const macdLine = shortEMA.map((ema, index) => ema - longEMA[index]);
        const signalLine = this.calculateEMA(macdLine, this.signalPeriod);

        return { macdLine, signalLine };
    }

    execute(market: Market): string {
        const prices: number[] = market.chart.map(candle => candle['close']);
        if (prices.length < this.longPeriod) {
            return 'Not enough data to compute MACD';
        }

        const { macdLine, signalLine } = this.calculateMACD(prices);
        const lastMacd = macdLine[macdLine.length - 1];
        const lastSignal = signalLine[signalLine.length - 1];
        const fiat: Currency = market.wallet.findFiat();
        const crypto: Currency = market.wallet.currency.filter(currency => currency !== fiat)[0];
        const lastPrice: number = prices[prices.length - 1];

        process.stderr.write(`MACD Line: ${lastMacd}, Signal Line: ${lastSignal}, Last Price: ${lastPrice}\n`);

        if (lastMacd > lastSignal && fiat.quantity > 0) {
            process.stderr.write(`Buying ${fiat.quantity / lastPrice} ${market.pair} at ${lastPrice}\n`);
            return new Order(OrderType.BUY, market.pair, fiat.quantity / lastPrice).toString();
        } else if (lastMacd < lastSignal && crypto.quantity > 0) {
            process.stderr.write(`Selling ${crypto.quantity} ${market.pair} at ${lastPrice}\n`);
            return new Order(OrderType.SELL, market.pair, crypto.quantity).toString();
        }
    }
}
