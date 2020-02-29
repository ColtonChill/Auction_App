import { connection } from '../services/Database';
import { comparePassword, encryptPassword } from '../services/Encryption'
import InvalidKeyError from './InvalidKeyError';

/**
 * A class that represents a User in the database. Provides static methods to 
 * fetch users from the database, and allows changes to the data.
 * 
 * The update method allows for updating the database to 
 * reflect this object, and the reload method allows for 
 * setting the database data into this object.
 * 
 * @remarks
 * Don't worry too much about this class's internals. Use the properties
 * available, and call update() when you're done.
 * 
 * @author Hunter Henrichsen
 */
export default class User {

    /**
     * This user's first name.
     */
    private _firstName: String;

    /**
     * This user's last name.
     */
    private _lastName: String;

    /**
     * This user's email.
     */
    private _email: String;

    /**
     * Keeps track of the database ID for this user.
     */
    private _id: Number;

    /**
     * Keeps track of whether this has been changed so that it needs updated in the database.
     */
    private _dirty: Boolean;

    // These fields haven't been set up yet.
    // private _permissions: PermissionGroup;
    // private _auctions: Auction[];

    /**
     * Creates a User object.
     * @param id The user's ID in the database.
     * @param email The user's email.
     * @param firstName The user's first name.
     * @param lastName The user's last name.
     */
    private constructor(id: Number, email: String, firstName: String, lastName: String) {
        this._email = email;
        this._firstName = firstName;
        this._lastName = lastName;
        this._id = id;
        this._dirty = false;
    }

    /**
     * Creates a user.
     * @param email 
     * @param firstName 
     * @param lastName 
     * @param rawPassword 
     */
    static async createUser(email: String, firstName: String, lastName: String, rawPassword: String) : User {
        const hash = await encryptPassword(rawPassword); 
        const dbObject = await connection('users').insert({
            'email': email,
            'first_name': firstName,
            'last_name': lastName,
            'password_hash': hash
        }).returning('*');
        return this.fromObject(dbObject);
    } 

    /**
     * Fetches a user from the database based on their numeric ID.
     * @param id The user's numeric ID.
     */
    static async fromDatabaseId(id: Number) : Promise<User> {
        const dbObject = await connection('users').where({id}).first();
        if (dbObject === undefined) {
            throw new InvalidKeyError(`No user exists with the id ${id}.`)
        }
        return User.fromObject(dbObject);
    }

    /**
     * Fetches a user from the database based on an email and password.
     * @param email The user's email.
     * @param attempt The user's password attempt.
     */
    static async fromDatabaseEmailPassword(email: String, attempt: String) : Promise<User> {
        const dbObject = await connection('users').where({
            'email': email,
        }).first();
        if (dbObject === undefined || !comparePassword(dbObject['password_hash'], attempt)) {
            throw new InvalidKeyError(`No user exists with this username/password population.`)
        }
        return User.fromObject(dbObject);
    }

    /**
     * Creates a user from an object.
     * @param object The object to turn into a User.
     */
    private static fromObject(object: Object) {
        const user = new User(object['id'], object['email'], object['first_name'], object['last_name'])
        return user;
    }


    /**
     * Updates the database with any changed information on the user.
     */
    public async update() {
        if (this._dirty) {
            await connection('users').where({ 'id': this._id }).update({
                'first_name': this._firstName,
                'last_name': this._lastName
            }).then(_ => this._dirty = false);
        }
        else {
            return Promise.resolve();
        }
    }

    /**
     * Reloads this user's information from the database.
     */
    public async reload() {
        const dbObject = await connection('users').where({'id': this._id}).update({
            'first_name': this._firstName,
            'last_name': this._lastName
        }).returning('*').then(_ => this._dirty = false);
        this._firstName = dbObject['first_name'];
        this._lastName = dbObject['last_name'];
        this._email = dbObject['email'];
        this._id = dbObject['id']; // If this changes something has gone horribly wrong.
    }

    /**
     * @returns The first name of this user.
     */
    public get firstName() {
        return this._firstName;
    }
    

    /**
     * @param value The value to set this user's first name to.
     * 
     * @remarks Sets the dirty flag.
     */
    public set firstName(value: String) {
        this._firstName = value;
        this._dirty = true;
    }

    /**
     * @returns The last name of this user.
     */
    public get lastName() {
        return this._lastName;
    }

    /**
     * @param value The value to set this user's last name to.
     * 
     * @remarks Sets the dirty flag.
     */
    public set lastName(value: String) {
        this._lastName = value;
        this._dirty = true;
    }

    /**
     * @returns The ID of this user.
     */
    public get id() {
        return this._id;
    }

    /**
     * @returns The email of this user.
     */
    public get email() {
        return this._email;
    }

    /**
     * @returns If the dirty flag has been set on this user.
     */
    public get isDirty() {
        return this._dirty;
    }
}