import { SettingsService } from '../services/settings';
import { validateSettings } from '../utils/validation';

// School Settings API Controller
// Note: These are ready to be integrated into Next.js Route Handlers (app/api/settings/route.ts)

export const settingsController = {
    // GET /settings
    getSettings: async () => {
        try {
            const settings = await SettingsService.getSettings();
            return { status: 200, data: settings };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // PUT /settings
    updateSettings: async (data: any) => {
        try {
            // For updates, we might not require all fields, but let's check what's provided
            const updatedSettings = await SettingsService.updateSettings(data);
            return { status: 200, data: updatedSettings };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },


};
