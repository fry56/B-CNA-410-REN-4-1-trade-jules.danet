export enum OrderType {
    BUY = 'buy',
    SELL = 'sell'
}

export class Order {
    public type: OrderType;
    public pair: string;
    public amount: number;

    constructor(type, pair, amount) {
        this.type = type;
        this.pair = pair;
        this.amount = amount;
    }

    toString(): string {
        return `${this.type} ${this.pair} ${this.amount}`;
    }
}