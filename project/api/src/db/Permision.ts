import User from "./User";
import Auction from "./Auction";
import { connection } from "../services/Database";


export default class Permission {

    private constructor(private _user: User, private _auction: Auction, private _canViewResults: boolean, private _canEditItems: boolean, private _canEditPermissions: boolean) { }

    public static async fromDatabase(user: number, auction: number) : Promise<Permission> {
        const dbObject = connection('permissions').where({ user, auction });
        return this.fromObject(dbObject);
    }

    public static async createPermissions(user: number, auction: number) : Promise<Permission> {
        const dbObject = connection('permissions').insert({ user, auction });
        return this.fromObject(dbObject);
    }

    private static async fromObject(obj: Object) : Promise<Permission> {
        const user = await User.fromDatabaseId(obj['user']);
        const auction = await Auction.fromDatabaseID(obj['auction']);
        return new Permission(user, auction, obj['can_view_results'], obj['can_edit_items'], obj['can_edit_permissions']);
    }

    public get canViewResults() : boolean {
        return this._canViewResults;
    }
    public get canEditItems() : boolean {
        return this._canEditItems;
    }
    public get canEditPermissions() : boolean {
        return this._canEditPermissions;
    }
}