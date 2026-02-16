import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errors';

export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
}

export const RoleService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('roles')
            .select('*');
        if (error) throw new Error(handleSupabaseError(error));
        return data as Role[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .eq('id', id)
            .single();
        if (error) return null;
        return data as Role;
    },

    getByName: async (name: string) => {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .eq('name', name)
            .single();
        if (error) return null;
        return data as Role;
    },

    create: async (data: Omit<Role, 'id'>) => {
        const { data: newRole, error } = await supabase
            .from('roles')
            .insert([data])
            .select()
            .single();
        if (error) throw new Error(handleSupabaseError(error));
        return newRole as Role;
    },

    update: async (id: string, data: Partial<Role>) => {
        const { data: updatedRole, error } = await supabase
            .from('roles')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        if (error) return null;
        return updatedRole as Role;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', id);
        if (error) return false;
        return true;
    }
};
