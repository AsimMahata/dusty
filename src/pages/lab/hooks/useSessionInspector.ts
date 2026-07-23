import { useState } from 'react';
import { getValueBySessionIdIPC, addOrUpdateBySessionIdIPC } from '../../../personalities/ambiverts/session';

export const useSessionInspector = () => {
    const [sessionKey, setSessionKey] = useState<string>('default_terminal');
    const [sessionValue, setSessionValue] = useState<string>('');
    const [newValueInput, setNewValueInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const querySessionKey = async (keyToQuery?: string) => {
        const key = keyToQuery || sessionKey;
        if (!key.trim()) return;

        setIsLoading(true);
        setStatusMsg(null);
        try {
            const rawVal = await getValueBySessionIdIPC(key);
            if (rawVal) {
                try {
                    // Prettify if JSON
                    const parsed = JSON.parse(rawVal);
                    setSessionValue(JSON.stringify(parsed, null, 2));
                    setNewValueInput(JSON.stringify(parsed, null, 2));
                } catch {
                    setSessionValue(rawVal);
                    setNewValueInput(rawVal);
                }
                setStatusMsg(`Successfully retrieved key "${key}"`);
            } else {
                setSessionValue('null (key not found or empty)');
                setNewValueInput('');
                setStatusMsg(`Key "${key}" was not found in session storage.`);
            }
        } catch (err) {
            setSessionValue(`Error: ${String(err)}`);
            setStatusMsg(`Failed to query session key "${key}".`);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSessionKey = async () => {
        if (!sessionKey.trim()) return;

        setIsLoading(true);
        setStatusMsg(null);
        try {
            await addOrUpdateBySessionIdIPC(sessionKey, newValueInput);
            setSessionValue(newValueInput);
            setStatusMsg(`Successfully saved key "${sessionKey}"`);
        } catch (err) {
            setStatusMsg(`Failed to save session key: ${String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        sessionKey,
        setSessionKey,
        sessionValue,
        newValueInput,
        setNewValueInput,
        isLoading,
        statusMsg,
        querySessionKey,
        saveSessionKey
    };
};
