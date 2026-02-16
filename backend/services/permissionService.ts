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
    /**
     * Checks if a user has a specific role
     */
    checkRole: async (userId: string, requiredRole: string): Promise<boolean> => {
        try {
            // Joining users and roles to check the role name
            const { data, error } = await supabase
                .from('users')
                .select(`
          roles (
            name
          )
        `)
                .eq('id', userId)
                .single();

            if (error || !data || !data.roles) return false;
            // Handle array or single object from Supabase join
            const roleName = Array.isArray(data.roles) ? data.roles[0]?.name : (data.roles as any).name;
            return roleName === requiredRole;
        } catch (err) {
            console.error('PermissionService.checkRole error:', err);
            return false;
        }
    },

    /**
     * Checks if a user has a specific permission based on their role
     */
    checkPermission: async (userId: string, actionName: string): Promise<boolean> => {
        try {
            // Get role permissions via user's roleId join
            const { data, error } = await supabase
                .from('users')
                .select(`
          roles (
            name,
            permissions
          )
        `)
                .eq('id', userId)
                .single();

            if (error || !data || !data.roles) return false;

            const roles = Array.isArray(data.roles) ? data.roles[0] : (data.roles as any);
            return roles.permissions?.includes(actionName) || false;
        } catch (err) {
            console.error('PermissionService.checkPermission error:', err);
            return false;
        }
    }
};
