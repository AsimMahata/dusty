import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { CMD_TOKENIZE } from '../../../constants/commands';

export const useTokenizeTest = () => {
    const [tokenInput, setTokenInput] = useState('');
    const [tokenizedResult, setTokenizedResult] = useState<string[]>([]);
    const [isTokenizing, setIsTokenizing] = useState(false);

    const handleTokenize = async () => {
        if (!tokenInput.trim()) return;
        
        setIsTokenizing(true);
        try {
            const result: string[] = await invoke(CMD_TOKENIZE, { input: tokenInput });
            setTokenizedResult(result);
        } catch (error) {
            console.error('Failed to tokenize:', error);
        } finally {
            setIsTokenizing(false);
        }
    };

    return {
        tokenInput,
        setTokenInput,
        tokenizedResult,
        isTokenizing,
        handleTokenize
    };
};
