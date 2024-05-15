import { Strategy } from "../interface/strategy.interface.js";
import { Market } from "../class/market.class.js";
import {Order, OrderType} from "../class/order.class.js";
import {Currency} from "../class/currency.class.js";

export class MaStrategy implements Strategy {
    private readonly shortPeriod: number;
    private readonly longPeriod: number;
    private readonly rsiPeriod: number;

    constructor(shortPeriod: number, longPeriod: number, rsiPeriod: number) {
        this.shortPeriod = shortPeriod;
        this.longPeriod = longPeriod;
        this.rsiPeriod = rsiPeriod;
    }

    private calculateRSI(prices: number[], period: number): number {
        let gains: number = 0;
        let losses: number = 0;

        for (let i = 1; i <= period; i++) {
            const difference: number = prices[prices.length - i] - prices[prices.length - i - 1];

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

    private calculateMovingAverage(prices: number[], period: number): number {
        const relevantPrices: number[] = prices.slice(-period);
        const sum: number = relevantPrices.reduce((acc, price) => acc + price, 0);

        return sum / period;
    }

    execute(market: Market): string {
        const prices: number[] = market.chart.map(candle => candle['close']).slice(-this.longPeriod + 1);
        const shortMA: number = this.calculateMovingAverage(prices, this.shortPeriod);
        const longMA: number = this.calculateMovingAverage(prices, this.longPeriod);
        const rsi: number = this.calculateRSI(prices, this.rsiPeriod);
        const lastPrice: number = prices[prices.length - 1];
        const fiat: Currency = market.wallet.findFiat();
        const crypto: Currency = market.wallet.currency.filter(currency => currency !== fiat)[0];

        process.stderr.write(`Short MA: ${shortMA}, Long MA: ${longMA}, RSI: ${rsi}, Last Price: ${lastPrice}\n`);

        if (rsi < 30 && fiat.quantity > 0) {
            process.stderr.write(`Buying ${fiat.quantity / lastPrice} ${market.pair} at ${lastPrice}\n`);
            return new Order(OrderType.BUY, market.pair, fiat.quantity / lastPrice).toString();
        } else if (rsi > 70 && crypto.quantity > 0) {
            process.stderr.write(`Selling ${crypto.quantity} ${market.pair} at ${lastPrice}\n`);
            return new Order(OrderType.SELL, market.pair, crypto.quantity).toString();
        }
    }
}