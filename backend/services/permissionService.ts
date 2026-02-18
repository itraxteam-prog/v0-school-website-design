import { supabase } from '../utils/supabaseClient';

export interface Permission {
    id: string;
    name: string;
    description?: string;
}

export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions?: string[];
}

export const PermissionService = {
    checkRole: async (userId: string, requiredRole: string): Promise<boolean> => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single();

            if (error || !data) return false;
            // Support both internal role name and passed role name
            return data.role.toLowerCase() === requiredRole.toLowerCase();
        } catch (err) {
            console.error('PermissionService.checkRole error:', err);
            return false;
        }
    },

    checkPermission: async (userId: string, actionName: string): Promise<boolean> => {
        try {
            // 1. Get user's role name
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single();

            if (userError || !user) return false;

            // 2. Get permissions for that role
            const { data: role, error: roleError } = await supabase
                .from('roles')
                .select('permissions')
                .eq('name', user.role)
                .single();

            if (roleError || !role) return false;

            return role.permissions?.includes(actionName) || false;
        } catch (err) {
            console.error('PermissionService.checkPermission error:', err);
            return false;
        }
    }
};
