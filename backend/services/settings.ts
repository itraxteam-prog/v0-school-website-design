import { SchoolSettings, initialSettings } from '../data/settings';

// School Settings Service Logic
// In-memory object to simulate database for now
let currentSettings = { ...initialSettings };

export const SettingsService = {
    getSettings: () => {
        return currentSettings;
    },

    updateSettings: (data: Partial<SchoolSettings>) => {
        currentSettings = {
            ...currentSettings,
            ...data,
            schoolHours: {
                ...currentSettings.schoolHours,
                ...(data.schoolHours || {}),
            },
            defaultFeeStructure: {
                ...currentSettings.defaultFeeStructure,
                ...(data.defaultFeeStructure || {}),
            }
        };
        return currentSettings;
    },

    resetSettings: () => {
        currentSettings = { ...initialSettings };
        return currentSettings;
    }
};
