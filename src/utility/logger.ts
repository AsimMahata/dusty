import toast from 'react-hot-toast';

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
        console.log(this.formatMessage('INFO', message, ...args));
    }

    warn(message: string, ...args: any[]) {
        console.warn(this.formatMessage('WARN', message, ...args));
    }

    error(message: string, ...args: any[]) {
        console.error(this.formatMessage('ERROR', message, ...args));
    }

    debug(message: string, ...args: any[]) {
        console.debug(this.formatMessage('DEBUG', message, ...args));
    }

    success(message: string, ...args: any[]) {
        console.log(this.formatMessage('SUCCESS', message, ...args));
    }

    todo(message: string, ...args: any[]) {
        console.warn(this.formatMessage('TODO', message, ...args));
        toast('TODO: ' + message);
    }
}

export const logger = new Logger();
