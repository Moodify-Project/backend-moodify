import bcrypt from 'bcrypt';

const generateHashedPassword = (saltRounds: number, password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (error, salt) => {
            if (error) {
                return reject(error);
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }

                return resolve(hash);
            });
        });
    });
};

export const checkedPassword = (inputPassword: string, storedPassword: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(inputPassword, storedPassword, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return reject(err);
            }

            if (result) {
                console.log('Passwords match! User authenticated.');
                return resolve(true);
            } else {
                console.log('Passwords do not match! Authentication failed.');
                return resolve(false);
            }
        });
    });
}

export default generateHashedPassword;
 