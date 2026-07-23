import { Terminal } from "@xterm/xterm"
import { FitAddon } from '@xterm/addon-fit';
import "@xterm/xterm/css/xterm.css"
import { spawn } from "tauri-pty";
import { useEffect, useRef } from "react";
import { xtermOptions, getShellExecutable, type TerminalTab } from "../../terminal.options";
import { logger } from "../../../../utility/logger";
export interface TerminalContentProps {
    tab: TerminalTab
}
export const TerminalContent: React.FC<TerminalContentProps> = ({ tab }) => {
    const termRef = useRef<HTMLDivElement>(null);
    const handleFitRef = useRef<() => void>(() => {});

    useEffect(() => {
        if (tab.active) {
            requestAnimationFrame(() => {
                handleFitRef.current();
            });
        }
    }, [tab.active]);

    useEffect(() => {
        if (!termRef.current) return;

        let isMounted = true;
        let pty: any = null;
        let dataSub: any = null;
        let exitSub: any = null;
        let termDataSub: any = null;
        let termResizeSub: any = null;
        let resizeObserver: ResizeObserver | null = null;

        const term = new Terminal({
            ...xtermOptions,
            convertEol: true,
        });
        const fitAddon = new FitAddon();

        term.open(termRef.current);
        term.loadAddon(fitAddon);

        const initPty = async () => {
            const targetShell = getShellExecutable(tab.shell);
            pty = await spawn(targetShell, [], {
                cols: term.cols || 80,
                rows: term.rows || 24,
            });

            if (!isMounted) {
                try { pty?.kill(); } catch (e) {}
                return;
            }

            const handleFit = () => {
                try {
                    fitAddon.fit();
                    if (term.cols && term.rows && term.cols > 0 && term.rows > 0 && pty?.resize) {
                        pty.resize(term.cols, term.rows);
                    }
                } catch (err){
                    // ignore fit errors during hidden/unmount states
                    console.error(err)
                }
            };

            handleFitRef.current = handleFit;

            resizeObserver = new ResizeObserver(() => {
                handleFit();
            });

            if (termRef.current) {
                resizeObserver.observe(termRef.current);
            }

            requestAnimationFrame(() => {
                handleFit();
            });

            dataSub = pty.onData((data: string) => { term.write(data); });
            exitSub = pty.onExit(({ exitCode }: { exitCode: number }) => { term.write(`\r\n\r\nProgram exit: ${exitCode}`); });
            termDataSub = term.onData(data => pty?.write?.(data));
            termResizeSub = term.onResize(e => pty?.resize?.(e.cols, e.rows));
        };

        initPty();

        return () => {
            isMounted = false;
            resizeObserver?.disconnect();
            dataSub?.dispose?.();
            exitSub?.dispose?.();
            termDataSub?.dispose?.();
            termResizeSub?.dispose?.();
            try {
                pty?.kill();
            } catch (e) {
                // ignore cleanup errors
            }
            term.dispose();
            logger.info("TERMINAL_DESTROYED");
        };
    }, []);

    return (
        <div
            ref={termRef}
            className="terminal-content-wrapper"
            style={{
                visibility: tab.active ? "visible" : "hidden",
                pointerEvents: tab.active ? "auto" : "none",
            }}
        />
    );
};
export default TerminalContent;
