const jwt = require('jsonwebtoken');

const JWT_SECRET = 'dev-secret-key-123';

function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

const adminToken = generateToken({ id: '1', email: 'admin@school.com', role: 'admin', name: 'Admin User' });
const teacherToken = generateToken({ id: '2', email: 'teacher@school.com', role: 'teacher', name: 'Teacher User' });
const studentToken = generateToken({ id: '3', email: 'student@school.com', role: 'student', name: 'Student User' });

console.log('Admin Token:', adminToken);
console.log('Teacher Token:', teacherToken);
console.log('Student Token:', studentToken);

// Verification test
try {
    const decoded = jwt.verify(adminToken, JWT_SECRET);
    console.log('Decoded Admin:', decoded);
} catch (err) {
    console.error('Verification failed:', err.message);
}
