import * as readline from "readline";
import { Interface } from "node:readline";
import { handleCommand } from "./command/commands.js";
import marketSingleton from "./class/market.class.js";
import { MaStrategy } from "./strategy/ma.strategy.js";
import {MacdRsiStrategy} from "./strategy/macd_rsi.strategy.js";

function handleInput(input: string): void {
    if (input.length === 0)
        return;
    const lines: string [] = input.trim().split("\n");

    for (const line of lines) {
        const args: string[] = line.trim().split(" ");
        if (args.length === 0)
            return;

        const command: string = args.shift().toLowerCase();

        try {
            const result: string | void = handleCommand(command, args);
            if (result)
                process.stdout.write(result + '\n');
        } catch (error) {
            process.stderr.write('Unable to execute command: ' + command + ', with data: ' + args + '\n');
            console.error(`[ERROR]: ${error}`);
        }
    }
}

function main(): void {
    const rl: Interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    marketSingleton.strategy = new MacdRsiStrategy(12, 26,9, 14);
    rl.on("line", handleInput);
    rl.on("close", () => process.exit(0));
}

main();