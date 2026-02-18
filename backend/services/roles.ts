export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
}

export const RoleService = {
    getAll: async () => {
        console.warn("RoleService.getAll: Supabase logic removed.");
        return [] as Role[];
    },

    getById: async (id: string) => {
        console.warn(`RoleService.getById(${id}): Supabase logic removed.`);
        return null;
    },

    getByName: async (name: string) => {
        console.warn(`RoleService.getByName(${name}): Supabase logic removed.`);
        return null;
    },

    create: async (data: Omit<Role, 'id'>) => {
        console.warn("RoleService.create: Supabase logic removed.");
        return null as any;
    },

    update: async (id: string, data: Partial<Role>) => {
        console.warn(`RoleService.update(${id}): Supabase logic removed.`);
        return null;
    },

    delete: async (id: string) => {
        console.warn(`RoleService.delete(${id}): Supabase logic removed.`);
        return true;
    }
};
