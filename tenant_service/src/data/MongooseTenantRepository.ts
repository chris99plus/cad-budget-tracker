import mongoose, { Schema } from "mongoose";
import { MongoServerError} from 'mongodb';
import { Tenant, TenantRepository } from "./TenantRepository";

const DUPLICATE_KEY_ERROR = 11000;

const tenantSchema = new Schema<Tenant>({
    name: { type: String, unique: true, required: true },
    tenant_secret: { type: String, unique: true, required: true }
}, {
    versionKey: false
});

const TenantModel = mongoose.model('Tenant', tenantSchema);


/**
 * Repository implementation which uses a mongo db using the mongoose framework
 */
export class MongooseTenantRepository implements TenantRepository {
    connectionString: string;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }
        
    async connect(): Promise<void> {
        await mongoose.connect(this.connectionString);
    }

    async createTenant(tenant: Tenant): Promise<Tenant> {
        const createdTenant = new TenantModel(tenant);
        createdTenant._id = new mongoose.Types.ObjectId();

        try {
            return await createdTenant.save();
        } catch(err: any) {
            if(!(err instanceof MongoServerError)) {
                console.log(err);
                throw err;
            }
            
            if(err.code == DUPLICATE_KEY_ERROR) {
                throw "The given tenant name is already taken."
            }
            else {
                console.log(err);
                throw "Failed to create tenant"
            }
        }
    }

    async getTenantBySecret(tenant_secret: string): Promise<Tenant | null> {
        const tenant = await TenantModel.findOne({
            tenant_secret: tenant_secret
        });

        return tenant;
    }

    async getAllTenants(): Promise<Tenant[]> {
        return await TenantModel.find([]);
    }
}
