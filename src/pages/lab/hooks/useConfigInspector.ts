import { useState } from 'react';
import { getConfigValueIPC, addOrUpdateConfigValueIPC } from '../../../personalities/ambiverts/config';

export const useConfigInspector = () => {
    const [configKey, setConfigKey] = useState<string>('default_terminal');
    const [configValue, setConfigValue] = useState<string>('');
    const [newValueInput, setNewValueInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const queryConfigKey = async (keyToQuery?: string) => {
        const key = keyToQuery || configKey;
        if (!key.trim()) return;

        setIsLoading(true);
        setStatusMsg(null);
        try {
            const rawVal = await getConfigValueIPC(key);
            if (rawVal !== null) {
                try {
                    // Prettify if JSON
                    const parsed = JSON.parse(rawVal);
                    setConfigValue(JSON.stringify(parsed, null, 2));
                    setNewValueInput(JSON.stringify(parsed, null, 2));
                } catch {
                    setConfigValue(rawVal);
                    setNewValueInput(rawVal);
                }
                setStatusMsg(`Successfully retrieved key "${key}"`);
            } else {
                setConfigValue('null (key not found or empty)');
                setNewValueInput('');
                setStatusMsg(`Key "${key}" was not found in config storage.`);
            }
        } catch (err) {
            setConfigValue(`Error: ${String(err)}`);
            setStatusMsg(`Failed to query config key "${key}".`);
        } finally {
            setIsLoading(false);
        }
    };

    const saveConfigKey = async () => {
        if (!configKey.trim()) return;

        setIsLoading(true);
        setStatusMsg(null);
        try {
            await addOrUpdateConfigValueIPC(configKey, newValueInput);
            setConfigValue(newValueInput);
            setStatusMsg(`Successfully saved key "${configKey}"`);
        } catch (err) {
            setStatusMsg(`Failed to save config key: ${String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        configKey,
        setConfigKey,
        configValue,
        newValueInput,
        setNewValueInput,
        isLoading,
        statusMsg,
        queryConfigKey,
        saveConfigKey
    };
};
