import { stringify } from "yaml";
import { exec } from "child_process";
import { TenantRepository } from "../data/TenantRepository";

export class InfrastructureController {
    tenantRepository: TenantRepository;

    constructor(tenantRepository: TenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    async createFreeTierInfrastructure(rootNamespace: string) {
        let helmVars = this.buildHelmVarsYaml(
            process.env.JWT_SECRET_KEY ?? "",
            "free",
            process.env.HOST_DOMAIN ?? ""
        );

        await this.createTenantInfrastructure(
            "free",
            rootNamespace,
            helmVars
        );
    }

    async createPremiumTierInfrastructure(rootNamespace: string) {
        let helmVars = this.buildHelmVarsYaml(
            process.env.JWT_SECRET_KEY ?? "",
            "premium",
            process.env.HOST_DOMAIN ?? ""
        );

        await this.createTenantInfrastructure(
            "premium",
            rootNamespace,
            helmVars
        );
    }

    async createInfrastructureForAllTenants(rootNamespace: string) {
        let tenants = await this.tenantRepository.getAllTenants();

        for (let tenant of tenants) {
            let helmVars = this.buildHelmVarsYaml(
                process.env.JWT_SECRET_KEY ?? "",
                tenant.name,
                process.env.HOST_DOMAIN ?? ""
            );
    
            await this.createTenantInfrastructure(
                tenant.name,
                rootNamespace,
                helmVars
            );
        }

        // TODO: Delete deployed infrastructure if no tenant is in the database
    }

    async createTenantInfrastructure(tenantName: string, rootNamespace: string, helmVars: string) {
        // FIXME: Sanitize tenantName input
        let namespace = tenantName;

        await this.executeShellCommand(`kubectl create namespace ${namespace}`);
        await this.executeShellCommand(`kubectl get secret regcred -n ${rootNamespace} -o yaml | sed s/"namespace: ${rootNamespace}"/"namespace: ${namespace}"/| kubectl apply -n ${namespace} -f -`);

        let helmInstallCmd = `helm install ${tenantName} ./../infrastructure/charts/tenant -n ${namespace} -f -`;
        let helmVarsYaml = helmVars.replace('"', '\\"');
        let cmd = `echo "${helmVarsYaml}" | ${helmInstallCmd}`;

        await this.executeShellCommand(cmd);
    }

    async configureKubectl(token: string, cacertPath: string) {
        await this.executeShellCommand(`kubectl config set-cluster cfc --server=https://kubernetes.default --certificate-authority=${cacertPath}`);
        await this.executeShellCommand(`kubectl config set-context cfc --cluster=cfc`);
        await this.executeShellCommand(`kubectl config set-credentials user --token=${token}`);
        await this.executeShellCommand(`kubectl config set-context cfc --user=user`);
        await this.executeShellCommand(`kubectl config use-context cfc`);
    }


    async updateInfrastructure(rootNamespace: string) {
        await this.executeShellCommand(`kubectl rollout restart deployment authentication-service -n ${rootNamespace}`);
        await this.executeShellCommand(`kubectl rollout restart deployment frontend -n ${rootNamespace}`);
        await this.executeShellCommand(`kubectl rollout restart deployment start-page -n ${rootNamespace}`);
        
        await this.executeShellCommand(`kubectl rollout restart deployment report-service -n free`);
        await this.executeShellCommand(`kubectl rollout restart deployment transaction-service -n free`);
        
        await this.executeShellCommand(`kubectl rollout restart deployment report-service -n premium`);
        await this.executeShellCommand(`kubectl rollout restart deployment transaction-service -n premium`);
        
        let tenants = await this.tenantRepository.getAllTenants();
        for (let tenant of tenants) {
            await this.executeShellCommand(`kubectl rollout restart deployment report-service -n ${tenant}`);
            await this.executeShellCommand(`kubectl rollout restart deployment transaction-service -n ${tenant}`);
        }
        
        await this.executeShellCommand(`kubectl rollout restart deployment tenant-service -n ${rootNamespace}`);
    }

    async executeShellCommand(cmd: string): Promise<number> {
        console.log(`Executing: ${cmd}`);

        return new Promise<number>((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    resolve(0);
                    console.log(error.message);
                    return;
                }
                if (stderr) {
                    resolve(0);
                    console.log(stderr);
                    return;
                }
                console.log(stdout);
                resolve(0);
            });
        });
    }

    private buildHelmVarsYaml(jwtSecret: string, tenantName: string, host: string) {
        return stringify({
            tenantSecret: {
                jwtSecret: jwtSecret
            },
            ingress: {
                hosts: [
                    {
                        host: `${tenantName}.${host}`
                    }
                ]
            },
            frontendService: {
                name: "frontend",
                namespace: "cad"
            },
            "transaction-service": {
                storage: {
                    connectionString: process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING,
                    containerName: process.env.AZURE_BLOB_STORAGE_CONTAINER_NAME
                }
            },
            authenticationService: {
                name: "authentication-service",
                namespace: "cad"
            }
        });
    }
}
