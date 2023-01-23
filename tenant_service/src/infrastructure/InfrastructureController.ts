
import { exec } from "child_process";
import { TenantRepository } from "../data/TenantRepository";

export class InfrastructureController {
    tenantRepository: TenantRepository;

    constructor(tenantRepository: TenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    async syncInfrastructure() {
        let tenants = await this.tenantRepository.getAllTenants();

        for (let tenant of tenants) {
            this.createTenantInfrastructure(tenant.name);
        }

        // TODO: Delete deployed infrastructure if no tenant is in the database
    }

    async createTenantInfrastructure(tenantName: string) {
        // FIXME: Sanitize tenantName input
        let namespace = tenantName;
        await this.executeShellCommand(`kubectl create namespace ${namespace}`);
        await this.executeShellCommand(`kubectl get secret regcred -n cad -o yaml | sed s/"namespace: cad"/"namespace: ${namespace}"/| kubectl apply -n ${namespace} -f -`);
        await this.executeShellCommand(`helm install ${tenantName} ./../infrastructure/charts/tenant -f ./../infrastructure/tenantVars.yaml -n ${namespace}`);
    }

    async updateTenantInfrastructure(tenantName: string) {

    }

    async listDeployedTenantInfrastructures() {

    }

    async configureKubectl(token: string, cacertPath: string) {
        await this.executeShellCommand(`kubectl config set-cluster cfc --server=https://kubernetes.default --certificate-authority=${cacertPath}`);
        await this.executeShellCommand(`kubectl config set-context cfc --cluster=cfc`);
        await this.executeShellCommand(`kubectl config set-credentials user --token=${token}`);
        await this.executeShellCommand(`kubectl config set-context cfc --user=user`);
        await this.executeShellCommand(`kubectl config use-context cfc`);
    }

    async executeShellCommand(cmd: string): Promise<number> {
        console.log(`Executing: ${cmd}`);


        return new Promise<number>((resolve, reject) => {
            let process = exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    resolve(0);
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    resolve(0);
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                resolve(0);
            });
        });
    }
}
