export class Currency {
    public quantity: number;
    public readonly isFiat: boolean;
    public readonly symbol: string;

    constructor(quantity: number, isFiat: boolean, symbol: string) {
        this.quantity = quantity;
        this.isFiat = isFiat;
        this.symbol = symbol;
    }
}