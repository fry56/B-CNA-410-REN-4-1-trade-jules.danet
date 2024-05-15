import { Command } from "../interface/command.interface.js"
import settingsCommand from "./settings.command.js";
import updateCommand from "./update.command.js";
import actionCommand from "./action.command.js";

const commands: Command[] = [
    { name: 'update', execute: updateCommand },
    { name: 'settings', execute: settingsCommand },
    { name: 'action', execute: actionCommand }
]

export function handleCommand(command: string, args: string[]): string | void {
    const cmd: Command | undefined = commands.find((cmd: Command) => cmd.name === command);

    if (cmd === undefined)
        throw new Error(`Command ${command} not found`);
    return cmd.execute(args);
}
