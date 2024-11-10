import bcrypt from 'bcrypt';

const generateHashedPassword = (saltRounds: number, password: string) => bcrypt.genSalt(saltRounds, (error: any, salt: any) => {
    if (error) {
        // Handle error
        return;
    }

    bcrypt.hash(password, salt, (err: any, hash: any) => {
        if (err) {
            // Handle error
            return;
        }

        return hash;

    })
});

export const checkedPassword = (inputPassword: string, storedPassword: string): boolean => {
    bcrypt.compare(inputPassword, storedPassword, (err, result) => {
        if (err) {
            // Handle error
            console.error('Error comparing passwords:', err);
            // throw new Error('Error comparing passwords:');
        }

        if (result) {
            // Passwords match, authentication successful
            console.log('Passwords match! User authenticated.');
            return true;
        } else {
            // Passwords don't match, authentication failed
            console.log('Passwords do not match! Authentication failed.');
            return false;
        }
    })

    return false;
}

export default generateHashedPassword;
