import { RoleService } from '../services/roles';
import { validateRole } from '../utils/validation';

// Roles API Routes
// Note: These are ready to be integrated into Next.js Route Handlers (app/api/roles/route.ts)

export const roleRoutes = {
    // GET /roles
    getAll: async () => {
        try {
            const roles = RoleService.getAll();
            return { status: 200, data: roles };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // GET /roles/:id
    getById: async (id: string) => {
        try {
            const role = RoleService.getById(id);
            if (!role) return { status: 404, error: 'Role not found' };
            return { status: 200, data: role };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // POST /roles
    create: async (data: any) => {
        try {
            const validation = validateRole(data);
            if (!validation.isValid) {
                return { status: 400, errors: validation.errors };
            }
            const newRole = RoleService.create(data);
            return { status: 201, data: newRole };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // PUT /roles/:id
    update: async (id: string, data: any) => {
        try {
            const updatedRole = RoleService.update(id, data);
            if (!updatedRole) return { status: 404, error: 'Role not found' };
            return { status: 200, data: updatedRole };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // DELETE /roles/:id
    delete: async (id: string) => {
        try {
            const success = RoleService.delete(id);
            if (!success) return { status: 404, error: 'Role not found' };
            return { status: 200, data: { message: 'Role deleted successfully' } };
        } catch (error) {
            return { status: 500, error: 'Internal Server Error' };
        }
    }
};
