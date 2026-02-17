import { RoleService } from '../services/roles';

async function verify() {
    console.log('🔄 Verifying RoleService.getAll()...');
    try {
        const roles = await RoleService.getAll();
        console.log('✅ Successfully fetched roles:', Array.isArray(roles) ? `${roles.length} roles found` : 'Error: Not an array');
        if (Array.isArray(roles)) {
            console.log('Sample Data:', roles.slice(0, 2));
        }
    } catch (error: any) {
        console.error('❌ RoleService verification failed:', error.message);
    } finally {
        process.exit(0);
    }
}

verify();
