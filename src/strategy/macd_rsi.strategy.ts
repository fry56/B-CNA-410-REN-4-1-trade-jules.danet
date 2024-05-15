import { Strategy } from "../interface/strategy.interface.js";
import { Market } from "../class/market.class.js";
import { Order, OrderType } from "../class/order.class.js";
import { Currency } from "../class/currency.class.js";

export class MacdRsiStrategy implements Strategy {
    private readonly shortPeriod: number;
    private readonly longPeriod: number;
    private readonly signalPeriod: number;
    private readonly rsiPeriod: number;

    constructor(shortPeriod: number, longPeriod: number, signalPeriod: number, rsiPeriod: number) {
        this.shortPeriod = shortPeriod;
        this.longPeriod = longPeriod;
        this.signalPeriod = signalPeriod;
        this.rsiPeriod = rsiPeriod;
    }

    private calculateEMA(prices: number[], period: number): number[] {
        const k: number = 2 / (period + 1);
        let emaArray: number[] = [];

        emaArray[0] = prices[0];
        for (let i = 1; i < prices.length; i++)
            emaArray[i] = prices[i] * k + emaArray[i - 1] * (1 - k);
        return emaArray;
    }

    private calculateMACD(prices: number[]): { macdLine: number[], signalLine: number[] } {
        const shortEMA: number[] = this.calculateEMA(prices, this.shortPeriod);
        const longEMA: number[] = this.calculateEMA(prices, this.longPeriod);
        const macdLine: number[] = shortEMA.map((ema, index) => ema - longEMA[index]);
        const signalLine: number[] = this.calculateEMA(macdLine, this.signalPeriod);

        return { macdLine, signalLine };
    }

    private calculateRSI(prices: number[], period: number): number {
        let gains: number = 0;
        let losses: number = 0;

        for (let i = prices.length - period; i < prices.length - 1; i++) {
            const difference: number = prices[i + 1] - prices[i];

            if (difference >= 0) {
                gains += difference;
            } else {
                losses -= difference;
            }
        }

        const averageGain: number = gains / period;
        const averageLoss: number = losses / period;
        const rs: number = averageGain / averageLoss;

        return 100 - (100 / (1 + rs));
    }

    execute(market: Market): string {
        const prices = market.chart.map(candle => candle['close']);

        if (prices.length < Math.max(this.longPeriod, this.rsiPeriod))
            return 'Not enough data to compute indicators';

        const { macdLine, signalLine } = this.calculateMACD(prices);
        const lastMacd: number = macdLine[macdLine.length - 1];
        const lastSignal: number = signalLine[signalLine.length - 1];
        const rsi: number = this.calculateRSI(prices, this.rsiPeriod);
        const fiat: Currency = market.wallet.findFiat();
        const crypto: Currency = market.wallet.currency.filter(currency => currency !== fiat)[0];
        const lastPrice: number = prices[prices.length - 1];

        if (lastMacd > lastSignal && rsi < 70 && fiat.quantity > 0) {
            process.stderr.write(`Buying ${fiat.quantity / lastPrice} ${market.pair} at ${lastPrice}\n`);
            return new Order(OrderType.BUY, market.pair, fiat.quantity / lastPrice).toString();
        } else if (lastMacd < lastSignal && rsi > 30 && crypto.quantity > 0) {
            process.stderr.write(`Selling ${crypto.quantity} ${market.pair} at ${lastPrice}\n`);
            return new Order(OrderType.SELL, market.pair, crypto.quantity).toString();
        }
    }
}
