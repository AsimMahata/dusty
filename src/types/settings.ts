export interface ResetActionConfig {
    id: string;
    buttonLabel: string;
    resettingLabel: string;
    buttonClass: string;
    command: string;
    modalTitle: string;
    modalMessage: string;
    confirmText: string;
    successMessage: string;
    errorMessagePrefix: string;
    loggerPrefix: string;
}
export interface SettingItemProps {
    id?: string;
    title: string;
    desc: string;
    type: 'select' | 'checkbox' | 'button';
    value?: any;
    onChange?: (val: any) => void;
    onClick?: () => Promise<boolean | void> | void;
    buttonText?: string;
    buttonClass?: string;
    options?: { value: string; label: string }[];
}

