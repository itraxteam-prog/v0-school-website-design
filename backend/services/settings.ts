import { SchoolSettings } from '../data/settings';
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';
import { revalidateTag } from 'next/cache';

// Mapping between Frontend (camelCase) and DB (snake_case)
const mapSettingsToDB = (data: Partial<SchoolSettings>) => {
    const mapped: any = {};
    if (data.schoolName !== undefined) mapped.school_name = data.schoolName;
    if (data.schoolCode !== undefined) mapped.school_code = data.schoolCode;
    if (data.address !== undefined) mapped.address = data.address;
    if (data.contactNumber !== undefined) mapped.contact_number = data.contactNumber;
    if (data.email !== undefined) mapped.email = data.email;
    if (data.termStructure !== undefined) mapped.term_structure = data.termStructure;
    if (data.gradingSystem !== undefined) mapped.grading_system = data.gradingSystem;
    if (data.promotionThreshold !== undefined) mapped.promotion_threshold = data.promotionThreshold;
    if (data.schoolHours !== undefined) mapped.school_hours = data.schoolHours;
    if (data.maxClassesPerDay !== undefined) mapped.max_classes_per_day = data.maxClassesPerDay;
    if (data.defaultFeeStructure !== undefined) mapped.default_fee_structure = data.defaultFeeStructure;
    if (data.portalPreferences !== undefined) mapped.portal_preferences = data.portalPreferences;
    return mapped;
};

const mapDBToSettings = (data: any): SchoolSettings => {
    return {
        schoolName: data.school_name,
        schoolCode: data.school_code,
        address: data.address,
        contactNumber: data.contact_number,
        email: data.email,
        termStructure: data.term_structure,
        gradingSystem: data.grading_system,
        promotionThreshold: data.promotion_threshold,
        schoolHours: data.school_hours,
        maxClassesPerDay: data.max_classes_per_day,
        defaultFeeStructure: data.default_fee_structure,
        portalPreferences: data.portal_preferences,
    };
};

export const SettingsService = {
    getSettings: async () => {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            console.error('SettingsService.getSettings Error:', error);
            throw new Error(handleSupabaseError(error));
        }
        return mapDBToSettings(data);
    },

    updateSettings: async (data: Partial<SchoolSettings>) => {
        const dbData = mapSettingsToDB(data);
        const { data: updated, error } = await supabase
            .from('settings')
            .update(dbData)
            .eq('id', 'current') // Using the actual ID from DB
            .select()
            .single();

        if (error) {
            console.error('SettingsService.updateSettings Error:', error);
            throw new Error(handleSupabaseError(error));
        }

        revalidateTag('settings');
        return mapDBToSettings(updated);
    }
};
