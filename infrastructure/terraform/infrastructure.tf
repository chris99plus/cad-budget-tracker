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
}


resource "helm_release" "ingress-controller" {
  name      = "cad-ingress-controller"
  chart     = "nginx-ingress"
  repository = "https://helm.nginx.com/stable"
  
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
  name    = "cad"
  value   = data.kubernetes_ingress_v1.ingress.status.0.load_balancer.0.ingress.0.ip
  type    = "A"
}
