import { getAvailableTerminalsIPC, openTerminalAtPathIPC } from "../../ambiverts/terminal";
import { getValueBySessionIdIPC } from "../../ambiverts/session";
import { logger } from "../../../utility/logger";

const SESSION_KEY_DEFAULT_TERMINAL = "default_terminal";

export const getSelectedTerminal = async (): Promise<string> => {
    try {
        const saved = await getValueBySessionIdIPC(SESSION_KEY_DEFAULT_TERMINAL);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return saved;
            }
        }
    } catch (e) {
        // Suppress expected error when session key is not initialized yet
    }

    const terminals = await getAvailableTerminalsIPC();
    if (terminals.length === 0) {
        throw new Error("No available terminals found on the system");
    }
    return terminals[0];
};

export const openTerminal = async (path: string): Promise<boolean> => {
    try {
        const terminal = await getSelectedTerminal();
        const success = await openTerminalAtPathIPC(path, terminal);
        if (success) {
            logger.info(`Opened terminal (${terminal}) at: ${path}`);
        }
        return success;
    } catch (err) {
        logger.error(`Failed to open terminal at path ${path}: ${String(err)}`);
        return false;
    }
};

