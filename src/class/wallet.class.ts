import {Currency} from "./currency.class.js";

export class Wallet {
    public currency: Currency[] = [];

    public addCurrency(currency: Currency): void {
        this.currency.push(currency);
    }

    public getCurrency(symbol: string): Currency | null {
        return this.currency.find((currency: Currency) => currency.symbol === symbol) || null;
    }

    public findFiat(): Currency | null {
        return this.currency.find((currency: Currency) => currency.isFiat) || null;
    }
}