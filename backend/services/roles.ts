import { Role, roles } from '../data/roles';

// Role Service Logic
// In-memory array to simulate database for now
let roleList = [...roles];

export const RoleService = {
    getAll: () => {
        return roleList;
    },

    getById: (id: string) => {
        return roleList.find(r => r.id === id);
    },

    create: (data: Omit<Role, 'id'>) => {
        const newRole: Role = {
            ...data,
            id: `role-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        roleList.push(newRole);
        return newRole;
    },

    update: (id: string, data: Partial<Role>) => {
        const index = roleList.findIndex(r => r.id === id);
        if (index === -1) return null;

        roleList[index] = { ...roleList[index], ...data };
        return roleList[index];
    },

    delete: (id: string) => {
        const index = roleList.findIndex(r => r.id === id);
        if (index === -1) return false;

        roleList.splice(index, 1);
        return true;
    }
};
