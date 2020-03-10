import { compareSync, genSaltSync, hashSync, genSalt, hash } from 'bcryptjs'

/**
 * Compares two passwords.
 * 
 * @param password1 The first password to compare.
 * @param password2 The second password to compare.
 */
export function comparePassword(password1: String, password2: String) : Boolean {
    return compareSync(password1, password2)
}

/**
 * Salts and encrypts a password.
 * 
 * @param password The password to encrypt.
 * @returns A salted and encrypted password.
 */
export function encryptPasswordSync(rawPassword: String) : String {
    const salt = genSaltSync();
    const passwordHash = hashSync(rawPassword, salt);
    return passwordHash;
}

/**
 * Salts and encrypts a password asynchronously.
 * 
 * @param password The password to encrypt.
 * @returns A salted and encrypted password.
 */
export async function encryptPassword(rawPassword: String) : Promise<String> {
    const salt = await genSalt();
    const passwordHash = await hash(rawPassword, salt);
    return passwordHash;
}