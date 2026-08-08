import toast from 'react-hot-toast';
import {
    warn as tauriWarn,
    debug as tauriDebug,
    trace as tauriTrace,
    info as tauriInfo,
    error as tauriError,
    attachConsole,
} from '@tauri-apps/plugin-log';

// Automatically attach console so Rust log messages print to webview console
attachConsole().catch(() => {});

class Logger {
    private formatMessage(level: string, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        
        // Parse stack trace to find caller
        const stack = new Error().stack?.split('\n');
        let caller = '';
        if (stack) {
            for (let i = 1; i < stack.length; i++) {
                const line = stack[i];
                if (!line.includes('logger.ts') && !line.includes('formatMessage')) {
                    caller = line.trim();
                    break;
                }
            }
        }

        let callerInfo = '';
        if (caller) {
            let clean = caller.replace(/^\s*at\s+/, '');
            clean = clean.replace(/https?:\/\/[^\/]+\/(src\/)?/, '');
            
            let funcName = '';
            let fileInfo = clean;
            const match = clean.match(/(.+?)\s*\((.+?)\)/);
            if (match) {
                funcName = match[1];
                fileInfo = match[2];
            }
            fileInfo = fileInfo.replace(/https?:\/\/[^\/]+\/(src\/)?/, '');
            fileInfo = fileInfo.replace(/:\d+$/, ''); // Remove column number
            
            if (funcName) {
                callerInfo = ` [${funcName} (${fileInfo})]`;
            } else {
                callerInfo = ` [${fileInfo}]`;
            }
        }

        let formattedArgs = '';
        if (args.length > 0) {
            formattedArgs = '\n' + args.map(arg => {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg, null, 2);
                }
                return String(arg);
            }).join('\n');
        }
        return `[${timestamp}] [${level}]${callerInfo} ${message}${formattedArgs}`;
    }

    info(message: string, ...args: any[]) {
        const formatted = this.formatMessage('INFO', message, ...args);
        console.log(formatted);
        tauriInfo(formatted).catch(() => {});
    }

    warn(message: string, ...args: any[]) {
        const formatted = this.formatMessage('WARN', message, ...args);
        console.warn(formatted);
        tauriWarn(formatted).catch(() => {});
    }

    error(message: string, ...args: any[]) {
        const formatted = this.formatMessage('ERROR', message, ...args);
        console.error(formatted);
        tauriError(formatted).catch(() => {});
    }

    debug(message: string, ...args: any[]) {
        const formatted = this.formatMessage('DEBUG', message, ...args);
        console.debug(formatted);
        tauriDebug(formatted).catch(() => {});
    }

    trace(message: string, ...args: any[]) {
        const formatted = this.formatMessage('TRACE', message, ...args);
        console.trace(formatted);
        tauriTrace(formatted).catch(() => {});
    }

    success(message: string, ...args: any[]) {
        const formatted = this.formatMessage('SUCCESS', message, ...args);
        console.log(formatted);
        tauriInfo(formatted).catch(() => {});
    }

    todo(message: string, ...args: any[]) {
        const formatted = this.formatMessage('TODO', message, ...args);
        console.warn(formatted);
        toast('TODO: ' + message);
        tauriWarn(formatted).catch(() => {});
    }
}

export const logger = new Logger();
