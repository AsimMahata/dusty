import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PRESET_IPC_COMMANDS,type IpcCommandPreset } from '../constants/constants';

export interface ApiExecutionLog {
    id: string;
    command: string;
    params: Record<string, any>;
    success: boolean;
    data: any;
    executionTimeMs: number;
    timestamp: string;
}

export const useApiConsole = () => {
    const [commandName, setCommandName] = useState<string>(PRESET_IPC_COMMANDS[0].command);
    const [paramJson, setParamJson] = useState<string>(
        JSON.stringify(PRESET_IPC_COMMANDS[0].defaultArgs, null, 2)
    );
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const [latestResult, setLatestResult] = useState<ApiExecutionLog | null>(null);
    const [history, setHistory] = useState<ApiExecutionLog[]>([]);

    const selectPreset = (preset: IpcCommandPreset) => {
        setCommandName(preset.command);
        setParamJson(JSON.stringify(preset.defaultArgs, null, 2));
    };

    const replayLog = (log: ApiExecutionLog) => {
        setCommandName(log.command);
        setParamJson(JSON.stringify(log.params || {}, null, 2));
        setLatestResult(log);
    };

    const executeIpc = async () => {
        if (!commandName.trim()) return;

        setIsExecuting(true);
        const startTime = performance.now();
        let parsedParams: Record<string, any> = {};

        try {
            if (paramJson.trim()) {
                parsedParams = JSON.parse(paramJson);
            }
        } catch (err) {
            const endTime = performance.now();
            const logItem: ApiExecutionLog = {
                id: Date.now().toString(),
                command: commandName,
                params: parsedParams,
                success: false,
                data: `JSON Parsing Error: ${(err as Error).message}`,
                executionTimeMs: Math.round(endTime - startTime),
                timestamp: new Date().toLocaleTimeString()
            };
            setLatestResult(logItem);
            setHistory(prev => [logItem, ...prev].slice(0, 20));
            setIsExecuting(false);
            return;
        }

        try {
            const responseData = await invoke(commandName, parsedParams);
            const endTime = performance.now();
            const logItem: ApiExecutionLog = {
                id: Date.now().toString(),
                command: commandName,
                params: parsedParams,
                success: true,
                data: responseData,
                executionTimeMs: Math.round(endTime - startTime),
                timestamp: new Date().toLocaleTimeString()
            };
            setLatestResult(logItem);
            setHistory(prev => [logItem, ...prev].slice(0, 20));
        } catch (error) {
            const endTime = performance.now();
            const logItem: ApiExecutionLog = {
                id: Date.now().toString(),
                command: commandName,
                params: parsedParams,
                success: false,
                data: String(error),
                executionTimeMs: Math.round(endTime - startTime),
                timestamp: new Date().toLocaleTimeString()
            };
            setLatestResult(logItem);
            setHistory(prev => [logItem, ...prev].slice(0, 20));
        } finally {
            setIsExecuting(false);
        }
    };

    return {
        presets: PRESET_IPC_COMMANDS,
        commandName,
        setCommandName,
        paramJson,
        setParamJson,
        isExecuting,
        latestResult,
        history,
        selectPreset,
        replayLog,
        executeIpc
    };
};
