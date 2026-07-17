class Logger {
    private formatMessage(level: string, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        let formattedArgs = '';
        if (args.length > 0) {
            formattedArgs = '\n' + args.map(arg => {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg, null, 2);
                }
                return String(arg);
            }).join('\n');
        }
        return `[${timestamp}] [${level}] ${message}${formattedArgs}`;
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
}

export const logger = new Logger();
