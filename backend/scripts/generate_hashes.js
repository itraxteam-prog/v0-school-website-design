const bcrypt = require('bcryptjs');

const saltRounds = 10;
const passwords = ['Admin@2024!', 'Teacher@2024!', 'Student@2024!'];

passwords.forEach(pw => {
    bcrypt.hash(pw, saltRounds, function (err, hash) {
        if (err) console.error(err);
        console.log(`Hash for ${pw}:`, hash);
    });
});
