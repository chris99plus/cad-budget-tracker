variable "AZURE_SUBSCRIPTION_ID" {
  type = string
}

variable "REGISTRY_USERNAME" {
  type = string
}

variable "REGISTRY_PASSWORD" {
  type = string
}

variable "REGISTRY_SERVER" {
  type = string
}

variable "REGISTRY_EMAIL" {
  type = string
}

variable "HETZNER_TOKEN" {
  type = string
}

variable "HETZNER_DNS_ZONE_ID" {
  type = string
}


terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.16.1"
    }

    hetznerdns = {
      source = "timohirt/hetznerdns"
      version = "2.1.0"
    }
  }

  # Configure terraform to store the state in an azure bucket
  backend "azurerm" {
    resource_group_name  = "budget-tracker-pipeline-rg"
    storage_account_name = "budgettrackerterraform"
    container_name       = "terraform"
    key                  = "prod.terraform.tfstate"
  }
}


# ------------------- Initial Azure infrastructure setup -------------------
provider "azurerm" {
  features {}

  subscription_id = var.AZURE_SUBSCRIPTION_ID
}

resource "azurerm_resource_group" "rg" {
  name     = "budget-tracker-app"
  location = "West Europe"
  tags = {
    project = "budget-tracker-app"
  }
}

resource "azurerm_kubernetes_cluster" "kubernetes_cluster" {
  name                = "budget-tracker-cluster"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "budget-tracker-cluster"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Production"
  }
}


resource "azurerm_storage_account" "cad-storage-account" {
  name                     = "budgettrackerstorageacc1"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "cad-storage-container" {
  name                  = "cad-storage-container"
  storage_account_name  = azurerm_storage_account.cad-storage-account.name
  container_access_type = "private"
}


# -------------------- Kubernetes setup --------------------
provider "kubernetes" {
  host                   = azurerm_kubernetes_cluster.kubernetes_cluster.kube_config.0.host
  client_certificate     = base64decode(azurerm_kubernetes_cluster.kubernetes_cluster.kube_config.0.client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.kubernetes_cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.kubernetes_cluster.kube_config.0.cluster_ca_certificate)
}


resource "kubernetes_namespace" "cad_namespace" {
  metadata {
    name = "cad"
  }
}


resource "kubernetes_secret" "regcred_secret" {
  metadata {
    name = "regcred"
    namespace = "cad"
  }
  
  type = "kubernetes.io/dockerconfigjson"

  data = {
    ".dockerconfigjson" = jsonencode({
      auths = {
        "${var.REGISTRY_SERVER}" = {
          "username" = var.REGISTRY_USERNAME
          "password" = var.REGISTRY_PASSWORD
          "email" = var.REGISTRY_EMAIL
          "auth"     = base64encode("${var.REGISTRY_USERNAME}:${var.REGISTRY_PASSWORD}")
        }
      }
    })
  }
}



# --------------------- Helm setup to deploy the application itself ---------------------
provider "helm" {
  kubernetes {
    host                   = azurerm_kubernetes_cluster.kubernetes_cluster.kube_config.0.host
    cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.kubernetes_cluster.kube_config.0.cluster_ca_certificate)
    client_certificate     = base64decode(azurerm_kubernetes_cluster.kubernetes_cluster.kube_config.0.client_certificate)
    client_key             = base64decode(azurerm_kubernetes_cluster.kubernetes_cluster.kube_config.0.client_key)
  }
}

resource "helm_release" "budget-tracker" {
  name      = "budget-tracker"
  chart     = "./../charts/budget-tracker"
  namespace = "cad"

  values = [
    file("./../budgetTrackerTestVars.yaml")
  ]

  set {
    name = "transaction-service.storage.connectionString"
    value = azurerm_storage_account.cad-storage-account.primary_connection_string
  }
  set {
    name = "transaction-service.storage.containerName"
    value = azurerm_storage_container.cad-storage-container.name
  }
}


resource "helm_release" "ingress-controller" {
  name      = "cad-ingress-controller"
  chart     = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"

  values = [
    file("ingress-controller-config.yaml")
  ]
}


# Search for the ingress in order to get its ip address
data "kubernetes_ingress_v1" "ingress" {
  depends_on = [
    helm_release.budget-tracker,
    helm_release.ingress-controller
  ]

  metadata {
    name = "budget-tracker"
    namespace = "cad"
  }
}

# --------------------- DNS Setup to create the domain ---------------------
provider "hetznerdns" {
  apitoken = var.HETZNER_TOKEN
}

resource "hetznerdns_record" "hetzner_subdomain" {
  zone_id = var.HETZNER_DNS_ZONE_ID
  name    = "*.cad"
  value   = data.kubernetes_ingress_v1.ingress.status.0.load_balancer.0.ingress.0.ip
  type    = "A"
}


resource "hetznerdns_record" "hetzner_subdomain1" {
  zone_id = var.HETZNER_DNS_ZONE_ID
  name    = "cad"
  value   = data.kubernetes_ingress_v1.ingress.status.0.load_balancer.0.ingress.0.ip
  type    = "A"
}
