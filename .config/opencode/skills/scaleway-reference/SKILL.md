---
name: scaleway-reference
description: Full knowledge of Scaleway cloud services.
compatibility: opencode
---
You know all cloud services of Scaleway as-of 2026-03-07. **Source:** https://www.scaleway.com/en/docs/

# Scaleway Product Documentation — Complete Reference

## 1. Account & Organizations

**URL:** https://www.scaleway.com/en/docs/account/

### Overview

Creating a Scaleway account gives you access to the Scaleway console and API, enabling you to deploy products and services. All resources are organized around the concept of **Organizations** and **Projects**.

- **Organization:** The top-level entity associated with your Scaleway account. An Organization has a unique identifier (Organization ID) and groups all users, resources, and billing.
- **Project:** A logical grouping of Scaleway resources within an Organization. Each Organization comes with a default Project, and additional Projects can be created to separate environments (e.g., production, staging, development).
- **Members:** Users who belong to an Organization. Members can be granted different roles and permissions via IAM.

### Quickstart

1. Go to https://console.scaleway.com/ and click **Sign Up**.
2. Fill in your email address and password, accept the terms and conditions, then click **Create account**.
3. Verify your email address via the link sent to your inbox.
4. Add billing information (credit card or SEPA), which is required before creating chargeable resources.
5. Navigate to any product category in the left sidebar to start deploying resources.

### Key Concepts

| Concept | Description |
|---|---|
| **Organization** | Top-level grouping; all resources belong to an Organization |
| **Project** | Sub-grouping within an Organization for resource isolation |
| **Organization ID** | Unique UUID identifying your Organization |
| **API key** | Credentials (access key + secret key) for programmatic access |
| **SSH key** | Public key stored in your profile for Instance access |
| **Availability Zone (AZ)** | Isolated physical locations within a region (e.g., `fr-par-1`, `fr-par-2`, `fr-par-3`) |
| **Region** | Geographic area hosting multiple AZs (e.g., Paris `fr-par`, Amsterdam `nl-ams`, Warsaw `pl-waw`) |

### Product Availability by Region

| Region | Code | Available Products |
|---|---|---|
| Paris | `fr-par` | All products |
| Amsterdam | `nl-ams` | Instances, Kubernetes, Object Storage, Databases, VPC, and more |
| Warsaw | `pl-waw` | Instances, Kubernetes, Object Storage, Databases, VPC, and more |

### How-Tos

- **Create an account:** Register at console.scaleway.com with your email and billing information.
- **Manage SSH keys:** Navigate to **Account > SSH Keys** to add your public SSH key.
- **Generate an API key:** Navigate to **IAM > API Keys** to create a key pair for programmatic access.
- **Create a Project:** Navigate to the **Projects** section and click **Create Project**.
- **Switch between Projects:** Use the Project selector in the console top bar.

## 2. Identity and Access Management (IAM)

**URL:** https://www.scaleway.com/en/docs/iam/

### Overview

Identity and Access Management (IAM) allows you to share access to the management of your Scaleway resources and Organization settings in a controlled and secure manner. IAM enables fine-grained permission control over who can do what with which resources.

### Key Concepts

| Concept | Description |
|---|---|
| **User** | A human member of your Organization with console/API access |
| **Application** | A non-human principal (e.g., a CI/CD pipeline) that interacts via API keys |
| **Group** | A collection of Users and/or Applications sharing the same policies |
| **Policy** | A set of rules that define permissions granted to a principal |
| **Role** | Predefined permission sets (e.g., Owner, Administrator, Editor, Viewer) |
| **Principal** | An entity (User, Application, or Group) to which a policy is attached |
| **Permission set** | A granular bundle of permissions for a specific product or action |
| **Scope** | Defines which Projects/Organization a policy applies to |
| **API key** | Access key + secret key pair used by Users or Applications to authenticate |

### How IAM Works

1. **Principals** (Users, Applications, Groups) are defined within an Organization.
2. **Policies** are created, specifying which Permission Sets are granted to which Principal(s), scoped to the whole Organization or specific Projects.
3. **API keys** are generated per User or Application and carry the permissions of their owner.

### How-Tos

- **Create an IAM user:** Navigate to **IAM > Users**, click **+ Invite User**, enter the email, and select a role.
- **Create an IAM application:** Navigate to **IAM > Applications**, click **+ Create Application**, and then generate an API key for it.
- **Create an IAM group:** Navigate to **IAM > Groups**, click **+ Create Group**, name it, and add Users and/or Applications.
- **Create an IAM policy:** Navigate to **IAM > Policies**, click **+ Create Policy**, select a principal, and assign permission sets scoped to a Project or the whole Organization.
- **Create an API key:** Navigate to **IAM > API Keys**, click **+ Generate API Key**, select the owner, and optionally set an expiry date.
- **Comply with security requirements:** Members can be required to enable multi-factor authentication (MFA) via Organization security settings.

### Best Practices

- Follow the **principle of least privilege**: grant only the permissions required.
- Use **Applications** (not personal user API keys) for automated pipelines and services.
- Regularly **rotate API keys** and set expiry dates.
- Use **Groups** to simplify permission management across multiple users.

## 3. Compute — CPU & GPU Instances

**URL:** https://www.scaleway.com/en/docs/instances/

### Overview

Scaleway Instances are virtual machines (VMs) in the cloud. They provide on-demand computing resources and can be created, started, stopped, and deleted at any time. Instances support a range of workloads, from development and testing to high-performance production applications.

### Instance Ranges

| Range | Description | Use Case |
|---|---|---|
| **PLAY2** | Cost-effective shared vCPU | Dev/test, small apps |
| **PRO2** | General-purpose shared vCPU | Web servers, small databases |
| **DEV1** | Development with local storage | Development & testing |
| **GP1** | General-purpose, balanced CPU/RAM | Balanced workloads |
| **ENT1** | Enterprise-grade dedicated vCPU | Production workloads |
| **POP2** | High-performance dedicated vCPU | CPU-intensive workloads |
| **POP2-HC** | High core count | Multi-threaded applications |
| **POP2-HM** | High memory | In-memory databases |
| **COPARM1** | ARM64 architecture | ARM-optimized workloads |
| **STARDUST1** | Ultra-affordable, free-tier | Learning, experiments |

### Key Concepts

| Concept | Description |
|---|---|
| **Local Storage** | Storage physically attached to the Instance host; fast but not persistent across hosts |
| **Block Storage** | Network-attached persistent storage (can be detached/reattached) |
| **Image** | Operating system template used to create an Instance (e.g., Ubuntu, Debian, Windows) |
| **Snapshot** | Point-in-time backup of a volume |
| **Security Group** | Virtual firewall controlling inbound/outbound traffic |
| **Flexible IP** | Static public IP address that can be moved between Instances |
| **Private Network** | Isolated Layer 2 network for Instance-to-Instance communication |
| **Cloud-init** | Tool for automating Instance initialization on first boot |
| **IPMI** | Out-of-band management interface for bare-metal-like access |
| **Bootscript** | (Legacy) Script run at Instance boot to configure the kernel |
| **ImageHub** | Catalog of pre-built community and partner images |

### Quickstart

1. In the console, click **CPU & GPU Instances** in the **Compute** section.
2. Click **Create Instance**, then select **Create CPU Instance**.
3. Choose a **region** and **Availability Zone**.
4. Select an **Instance type** (e.g., DEV1-S, PRO2-S).
5. Choose an **image** (e.g., Ubuntu 22.04 LTS).
6. Configure **storage** (local or block volume size).
7. Configure **network** (attach to Private Network if needed).
8. Add your **SSH key** for remote access.
9. Optionally add **cloud-init** user data.
10. Click **Create Instance**.

### How-Tos

- **Connect via SSH:** `ssh root@<public-ip>` (Linux/Mac) or use PuTTY (Windows).
- **Stop/Start an Instance:** Use the console toggle or API.
- **Create a snapshot:** Navigate to **Storage > Snapshots** and create from a running volume.
- **Attach a Block Storage volume:** Go to **Storage > Block Storage**, create a volume, then attach it to an Instance.
- **Use Private Networks:** Attach an Instance to a Private Network from the Instance settings.
- **Manage security groups:** Navigate to **Compute > Security Groups** to define firewall rules.

### Storage Options

| Type | Performance | Persistence | Detachable |
|---|---|---|---|
| Local Storage | High (NVMe) | Tied to Instance | No |
| Block Storage 5K IOPS | Standard | Independent | Yes |
| Block Storage 15K IOPS | High | Independent | Yes |

### Bandwidth Overview

- **Public internet bandwidth** varies per Instance type (e.g., DEV1-S: 200 Mbps, POP2-64C-256G: 6 Gbps).
- **Block Storage bandwidth** is also Instance-type-dependent.

## 4. Compute — GPU Instances

**URL:** https://www.scaleway.com/en/docs/gpu/

### Overview

Scaleway GPU Instances are cloud servers equipped with NVIDIA GPUs, designed for compute-intensive workloads such as AI/ML training and inference, scientific simulation, video transcoding, and 3D rendering.

### Available GPU Instance Types

| Series | GPU | vCPUs | RAM | Use Case |
|---|---|---|---|---|
| **L4-1-24G** | NVIDIA L4 (24 GB) | 8 | 64 GB | Inference, AI video |
| **L40S-1-48G** | NVIDIA L40S (48 GB) | 12 | 96 GB | LLM inference, rendering |
| **H100-1-80G** | NVIDIA H100 SXM (80 GB) | 26 | 188 GB | LLM training, HPC |
| **H100-2-80G** | 2× NVIDIA H100 SXM | 52 | 376 GB | Large model training |
| **B300-SXM** | NVIDIA Blackwell B300 | – | – | Next-gen AI reasoning |
| **P100-NVLINK** | NVIDIA P100 (16 GB) | 10 | 45 GB | Training, simulation |

### Key Concepts

| Concept | Description |
|---|---|
| **CUDA** | NVIDIA's parallel computing platform and API |
| **MIG (Multi-Instance GPU)** | Partitioning a single GPU (H100) into up to 7 isolated slices |
| **VRAM** | GPU-dedicated video RAM for holding model weights |
| **NVIDIA Docker** | Container runtime with GPU support |
| **Routed IP** | Public IP attached to GPU Instances |

### Quickstart

1. Click **CPU & GPU Instances** in the **Compute** section.
2. Click **Create Instance**, then select **Create GPU Instance**.
3. Select a region (GPU availability may vary by AZ).
4. Choose a GPU Instance type.
5. Select an image — Scaleway offers GPU-ready images with pre-installed CUDA, PyTorch, TensorFlow, etc.
6. Configure storage and SSH key, then click **Create Instance**.

### Pre-installed Environments

GPU Instances come with Scaleway-maintained images including:

- CUDA Toolkit
- cuDNN
- PyTorch
- TensorFlow
- Jupyter Notebook
- Docker with NVIDIA Container Toolkit

### MIG (Multi-Instance GPU)

On H100 Instances, MIG allows splitting one GPU into multiple isolated slices, each with guaranteed memory and compute resources. You can create up to 7 MIG partitions and run separate workloads in isolation.

### Integration with Kubernetes

GPU Instances can be used as Kubernetes nodes in a Kapsule cluster, enabling GPU-accelerated workloads in containerized environments via the NVIDIA device plugin.

## 5. Compute — Apple Silicon (Mac mini)

**URL:** https://www.scaleway.com/en/docs/apple-silicon/

### Overview

Scaleway Apple Silicon offers Mac mini M1 and M2 machines as a cloud service, billed on an hourly basis. These are ideal for macOS-specific development, iOS/macOS app building, and Xcode compilation.

### Key Concepts

| Concept | Description |
|---|---|
| **Mac mini M1/M2** | Physical Apple silicon computers hosted in Scaleway datacenters |
| **macOS** | The native operating system (upgradeable via the console) |
| **VNC** | Remote graphical access to the Mac mini desktop |
| **SSH** | Command-line remote access |
| **Reinstall** | Wiping and re-provisioning the OS from the console |

### Quickstart

1. In the console, click **Apple Silicon** in the **Bare Metal** section.
2. Click **+ Create Mac mini**.
3. Select a region (available in Paris).
4. Choose a Mac mini type (M1 or M2).
5. Add your SSH key.
6. Click **Create Mac mini**.
7. Connect via SSH: `ssh admin@<public-ip>` or use VNC for graphical access.

### How-Tos

- **Connect via VNC:** Enable VNC from the console and use a VNC client (e.g., Screen Sharing on macOS).
- **Update macOS:** Navigate to the Mac mini details, scroll to **Reinstall Mac mini**, and select the desired macOS version.
- **Install Xcode:** Use the App Store or `xcode-select --install` from the terminal.

### Notes & Limitations

- Mac minis have a **minimum rental period** (typically 24 hours) due to Apple licensing requirements.
- The operating system disk cannot be resized or replaced with a custom image.
- Mac minis do not support Block Storage volumes.

## 6. Bare Metal — Elastic Metal

**URL:** https://www.scaleway.com/en/docs/elastic-metal/

### Overview

Scaleway Elastic Metal servers are **dedicated physical servers** provisioned on-demand, billed hourly or monthly. Unlike Instances (VMs), Elastic Metal gives you exclusive access to the full physical hardware — no hypervisor overhead, no noisy neighbors. They are ideal for high-performance workloads, big data processing, high-security environments, and applications that require specific hardware configurations.

### Key Concepts

| Concept | Description |
|---|---|
| **Dedicated server** | Physical server with exclusive hardware access |
| **IPMI (BMC)** | Baseboard Management Controller for out-of-band access |
| **Rescue mode** | Booting into a minimal environment for diagnostics/repair |
| **Installation** | The OS deployment process onto the physical disk |
| **Bandwidth** | Dedicated public internet uplink (uncontested) |
| **Private Network** | Attach Elastic Metal to an isolated VPC network |
| **Flexible IP** | Portable public IPs assignable to Elastic Metal servers |

### Available Server Families

| Family | CPU | RAM | Storage | Use Case |
|---|---|---|---|---|
| **EM-A210R-HDD** | AMD EPYC | 256 GB | HDD | Archive, backup |
| **EM-A315X-SSD** | AMD EPYC | 256 GB | NVMe SSD | General purpose |
| **EM-A410X-SSD** | AMD EPYC | 512 GB | NVMe SSD | High memory, databases |
| **EM-B112X-SSD** | Intel Xeon | 192 GB | NVMe SSD | High-frequency workloads |
| **EM-L101X-SATA** | Intel Xeon | 32 GB | SATA SSD | Light workloads |

### Quickstart

1. Click **Elastic Metal** in the **Bare Metal** section.
2. Click **+ Order Elastic Metal Server**.
3. Select an **Offer** (server configuration), **region**, and **AZ**.
4. Choose an **OS** to install (Ubuntu, Debian, Windows Server, CentOS, etc.) or install your own via IPMI.
5. Add your **SSH key**.
6. Click **Order**.
7. Wait for provisioning (typically a few minutes). Connect via SSH once ready.

### Stock Levels

Elastic Metal servers are physical machines, so availability is subject to stock. The console displays real-time availability:

- **Available now:** Servers ready to provision immediately.
- **On demand:** Servers provisionable within a short lead time.
- **Contact us:** Custom configurations requiring prior arrangement.

### Networking

- Each Elastic Metal server has a single physical NIC pre-configured with a public IP.
- Additional **Flexible IPs** can be attached for virtual IP or failover setups.
- **Private Networks** can be attached for secure inter-resource communication within a VPC.

### IPMI / BMC Access

- IPMI access is available 1 hour after server installation.
- Navigate to the server's **Remote Access** option in the console to enable BMC access.
- Use IPMI to perform out-of-band management, mount ISO images, and access the server even when the OS is unresponsive.

## 7. Bare Metal — Dedibox Dedicated Servers

**URL:** https://www.scaleway.com/en/docs/dedibox/

### Overview

Scaleway **Dedibox** are high-quality dedicated servers known for extreme reliability and best-in-class redundancy. Dedibox servers are managed through a dedicated console at https://console.online.net and are the historical Scaleway dedicated server offering (previously from Online.net). They offer:

- Monthly billing
- A wide range of server configurations
- Extended support options
- The RPN (Real Private Network) for inter-server communication
- IPMI/KVM access

### Key Concepts

| Concept | Description |
|---|---|
| **Dedibox** | Physical dedicated server, monthly billing |
| **RPN (Real Private Network)** | Scaleway's private network for Dedibox servers (Layer 2, up to 10 Gbps) |
| **RPN-SAN** | Network-attached storage accessible over the RPN |
| **IPMI/KVM** | Out-of-band management and remote console access |
| **DediBackup** | Backup storage solution for Dedibox servers |
| **Suchard** | Scaleway's internal name for some server management features |
| **Rescue mode** | Minimal boot environment for diagnostics and disk repair |

### Quickstart

1. Click **Dedibox** in the **Bare Metal** section.
2. Click **+ Order a Dedibox server** to launch the wizard.
3. Choose a server offer, data center location, and configuration.
4. Select an operating system or install manually via KVM.
5. Complete the order. Provisioning typically takes 2–72 hours depending on server type.

### Account Linking

You can link your Dedibox account to a Scaleway account for a unified billing experience. Navigate to **Account > Link Dedibox account** in the Scaleway console.

### RPN (Real Private Network)

The RPN is Dedibox's private inter-server network:
- Up to **10 Gbps** private bandwidth
- Supports **VLAN** segmentation
- Ideal for database replication, cluster heartbeats, backup traffic
- **RPN-SAN:** Enables shared network-attached storage over the RPN

### OS Installation

Dedibox supports automated OS installation for:
- Ubuntu, Debian, CentOS, AlmaLinux, Rocky Linux
- Windows Server
- Custom ISO via KVM

Partitioning, RAID, and filesystem options are configurable at install time.

## 8. Kubernetes — Kapsule & Kosmos

**URL:** https://www.scaleway.com/en/docs/kubernetes/

### Overview

Scaleway offers two managed Kubernetes services:

- **Kapsule:** A fully managed Kubernetes service where all nodes run exclusively on Scaleway Instances. Scaleway manages the control plane at no extra cost.
- **Kosmos:** A multi-cloud Kubernetes service where the control plane runs on Scaleway but nodes can be Scaleway Instances **or** external nodes from any cloud provider or on-premises environment.

### Kapsule vs. Kosmos

| Feature | Kapsule | Kosmos |
|---|---|---|
| Control plane | Managed by Scaleway | Managed by Scaleway |
| Worker nodes | Scaleway Instances only | Scaleway + external nodes |
| Multi-cloud | No | Yes |
| Node pools | Yes | Yes (multi-provider) |
| Use case | Standard Kubernetes | Hybrid/multi-cloud |

### Key Concepts

| Concept | Description |
|---|---|
| **Cluster** | A Kubernetes cluster (control plane + worker nodes) |
| **Node pool** | A group of worker nodes with the same configuration |
| **Control plane** | The Kubernetes master components (API server, scheduler, etcd) managed by Scaleway |
| **kubeconfig** | Configuration file for `kubectl` to connect to the cluster |
| **CNI (Container Network Interface)** | Plugin handling pod networking (Cilium or Weave) |
| **CSI (Container Storage Interface)** | Plugin for Block Storage volume management in Kubernetes |
| **Autoscaler** | Automatically scales node pools based on pending pods |
| **Private cluster** | A cluster where the Kubernetes API server is only accessible via Private Network |
| **LOKI** | Kubernetes version supported by Scaleway (regularly updated) |

### Quickstart (Kapsule)

1. Click **Kubernetes** in the **Compute** section of the console.
2. Click **+ Create Cluster**.
3. Select **Kapsule**, then choose a Kubernetes version.
4. Select a **region** and **AZ**.
5. Configure the **first node pool** (Instance type, size, autoscaling options).
6. Configure **networking** (Private Network recommended for production).
7. Click **Create Cluster**.
8. Download the kubeconfig: `scw k8s kubeconfig install <cluster-id>` or download from the console.
9. Verify: `kubectl get nodes`

### Node Pools

- Each pool has a fixed Instance type (e.g., PRO2-S, DEV1-M).
- Pools can be set to **autoscale** between a min and max node count.
- Multiple pools can be created per cluster (e.g., a general pool and a GPU pool).

### Networking

- Clusters can be configured with a **Private Network** for node communication, keeping traffic off the public internet.
- The **Cilium CNI** provides advanced networking features including network policies.
- The **Scaleway CSI driver** enables dynamic provisioning of Block Storage PersistentVolumes.

### Upgrades

- Scaleway manages control plane upgrades; node pool upgrades can be triggered manually or set to auto-upgrade.
- Old Kubernetes versions are periodically deprecated. Clusters on unsupported versions are automatically upgraded.

### Integrations

- **Scaleway Load Balancer:** Automatically provisioned when a `Service` of type `LoadBalancer` is created.
- **Scaleway Block Storage:** Used as PersistentVolumes via the CSI driver.
- **Scaleway Container Registry:** Native integration for pulling private container images.
- **Scaleway Managed Databases:** Can be connected to Kubernetes workloads.
- **Cockpit:** Metrics and logs from Kubernetes clusters are viewable in Cockpit.

## 9. Serverless — Functions

**URL:** https://www.scaleway.com/en/docs/serverless-functions/

### Overview

Scaleway **Serverless Functions** lets you run code without provisioning or managing servers. You write a function in a supported language, deploy it, and Scaleway handles execution, scaling, and billing (per invocation and compute time). Functions scale to zero when idle.

### Supported Runtimes

| Language | Versions |
|---|---|
| Node.js | 18, 20, 22 |
| Python | 3.10, 3.11, 3.12 |
| PHP | 8.2, 8.3 |
| Go | 1.21, 1.22 |
| Rust | 1.65+ |

### Key Concepts

| Concept | Description |
|---|---|
| **Function** | A stateless unit of code executed on demand |
| **Namespace** | A grouping of functions sharing environment variables and registry settings |
| **Trigger** | The event that invokes a function (HTTP request, CRON schedule) |
| **Runtime** | The language and version used to execute the function |
| **Cold start** | The initialization latency when a function scales from zero |
| **Scale-to-zero** | Functions stop consuming resources when not invoked |
| **Privacy** | Function endpoints can be public or private (token-based authentication) |
| **Secrets** | Sensitive environment variables injected securely at runtime |

### Quickstart

1. Click **Serverless > Functions** in the console.
2. Click **+ Create Function**.
3. Select a **namespace** (or create one).
4. Choose a **runtime** (e.g., Python 3.11).
5. Write your function inline or upload a ZIP archive.
6. Set environment variables and secrets.
7. Configure the **trigger** (HTTP or CRON).
8. Click **Deploy Function**.
9. Invoke via the generated HTTPS endpoint.

### Deployment Methods

- **Console:** Inline code editor for simple functions.
- **Scaleway CLI:** `scw function deploy`
- **Terraform / Pulumi:** Infrastructure-as-code deployment.
- **CI/CD pipelines:** GitHub Actions, GitLab CI integration.

### Billing

- Billed per **invocation** (number of calls) and per **GB-second** of compute time.
- A generous **free tier** covers millions of invocations and GB-seconds per month.

### Limits

- Maximum function execution time: 15 minutes.
- Maximum deployment package size: 100 MB (compressed).
- Maximum memory: 3008 MB.

## 10. Serverless — Containers

**URL:** https://www.scaleway.com/en/docs/serverless-containers/

### Overview

Scaleway **Serverless Containers** lets you deploy any containerized application without managing infrastructure. Unlike Functions (which require specific runtimes), Containers accept any Docker image, giving you full control over the runtime environment. Containers scale automatically, including to zero when idle.

### Key Concepts

| Concept | Description |
|---|---|
| **Container** | A Docker image deployed as a serverless workload |
| **Namespace** | Grouping of containers sharing configuration and registry credentials |
| **Port** | The port your container listens on (default 8080) |
| **Min/Max scale** | Minimum and maximum number of concurrent container instances |
| **Concurrency** | Number of simultaneous requests a single container instance handles |
| **Trigger** | HTTP requests or CRON schedules that invoke the container |
| **Privacy** | Public (open) or private (token-authenticated) access |
| **Registry** | Source of the container image (Scaleway Container Registry, Docker Hub, etc.) |

### Quickstart

1. Push your Docker image to Scaleway Container Registry (or Docker Hub).
2. In the console, click **Serverless > Containers**.
3. Click **+ Deploy Container**.
4. Select a **namespace** (or create one).
5. Enter the **image URL** from your registry.
6. Set the **port**, min/max scale, memory, and CPU limits.
7. Configure environment variables, secrets, and triggers.
8. Click **Deploy Container**.

### Differences: Jobs vs Functions vs Containers

| Feature | Functions | Containers | Jobs |
|---|---|---|---|
| Runtime | Fixed (Node, Python…) | Any Docker image | Any Docker image |
| Trigger | HTTP / CRON | HTTP / CRON | Manual / CRON / API |
| Duration | Up to 15 min | Up to 15 min | Unlimited |
| Scale to zero | Yes | Yes | N/A (task-based) |
| Use case | Event handlers, APIs | Web apps, APIs | Batch processing |

### Integrations

- **Container Registry:** Seamless image deployment from Scaleway's registry.
- **Secrets Manager:** Inject secrets as environment variables.
- **Serverless SQL Database:** Use as a backend database.
- **Private Networks:** Containers can be configured to communicate via VPC.

## 11. Serverless — Jobs

**URL:** https://www.scaleway.com/en/docs/serverless-jobs/

### Overview

Scaleway **Serverless Jobs** lets you run recurring and autonomous batch computing tasks in the cloud. Jobs are suited for large-scale, asynchronous, long-running tasks like data processing, image rendering, machine learning pipelines, and ETL workflows. Unlike Functions and Containers, Jobs have no time limit.

### Key Concepts

| Concept | Description |
|---|---|
| **Job definition** | A template defining the container image, resources, and schedule for a job |
| **Job run** | A single execution instance of a job definition |
| **CRON schedule** | A time-based schedule using cron syntax to trigger job runs |
| **Resources** | vCPU and memory allocated per job run |
| **Status** | States: Pending, Running, Succeeded, Failed, Canceled |
| **Timeout** | Maximum duration for a single job run (can be very long) |

### Quickstart

1. In the console, click **Serverless > Jobs**.
2. Click **+ Create Job**.
3. Select a container image source (Scaleway Container Registry or external).
4. Specify the image URL, vCPU, and memory.
5. Optionally set a **CRON schedule** for recurring runs.
6. Set environment variables and secrets.
7. Click **Create Job**.
8. Trigger a run manually or wait for the schedule.

### Use Cases

- **Data pipelines:** ETL processing, data transformation.
- **Batch rendering:** Video transcoding, 3D rendering.
- **ML training:** Long-running machine learning training jobs.
- **Report generation:** Scheduled PDF/report generation.
- **Database migrations:** One-time or scheduled migration scripts.

### Differences from Functions and Containers

Jobs are designed for **asynchronous, background** tasks:
- No inbound HTTP trigger (runs are triggered by API, schedule, or manual click).
- No scale-to-zero consideration (a job runs, completes, and terminates).
- Duration is **unlimited** (no 15-minute cap).

## 12. Serverless — SQL Databases

**URL:** https://www.scaleway.com/en/docs/serverless-sql-databases/

### Overview

Scaleway **Serverless SQL Databases** are fully managed, PostgreSQL-compatible databases that automatically scale both compute and storage. They scale **down to zero** when idle, making them cost-effective for intermittent workloads.

### Key Concepts

| Concept | Description |
|---|---|
| **Serverless database** | A fully managed DBaaS that auto-scales compute and storage |
| **Auto-scaling** | Compute scales up/down (including to zero) based on load |
| **Connection pooling** | Handled automatically; connections scale with CPU and RAM |
| **PostgreSQL compatibility** | Based on PostgreSQL engine with minor known differences |
| **Backup** | Automatic backups with point-in-time recovery |

### Quickstart

1. In the console, click **Serverless SQL Databases** (under Serverless).
2. Click **+ Create Database**.
3. Set a **database name** and select a region.
4. Configure **min/max vCPUs** for autoscaling.
5. Click **Create Database**.
6. Retrieve the connection string and connect with `psql` or any PostgreSQL client.

### PostgreSQL Compatibility

Serverless SQL Databases are based on the PostgreSQL engine and support most standard PostgreSQL features. Known differences include:

- Some administrative functions (e.g., `pg_cancel_backend` on other sessions) are restricted.
- `SUPERUSER` and `REPLICATION` roles are not available.
- Some extensions may not be supported.

Refer to the [known differences documentation](https://www.scaleway.com/en/docs/serverless-sql-databases/reference-content/known-differences/) for a full list.

### Auto-Scaling Behavior

- When no queries are running, compute scales to **zero** and billing stops.
- On the first query after idle, there is a **cold start** warm-up period (a few seconds).
- Storage scales independently of compute.

## 13. Storage — Object Storage

**URL:** https://www.scaleway.com/en/docs/object-storage/

### Overview

Scaleway **Object Storage** is an Amazon S3-compatible object storage service. It allows you to store any type of object (documents, images, videos, backups, logs, static website files) with virtually unlimited capacity, accessible from anywhere via HTTPS.

### Key Concepts

| Concept | Description |
|---|---|
| **Bucket** | A container for objects. Bucket names must be globally unique |
| **Object** | Any file stored in a bucket, identified by a key (path) |
| **Key** | The unique identifier (name) of an object within a bucket |
| **Bucket policy** | JSON policy defining access permissions for a bucket |
| **ACL** | Access Control List for per-object or per-bucket permissions |
| **Versioning** | Keeps multiple versions of an object for accidental deletion protection |
| **Lifecycle rules** | Automate object transitions (e.g., to Glacier) or deletion |
| **Multipart upload** | Split large file uploads into parts for reliability |
| **Presigned URL** | Time-limited URL granting temporary access to a private object |
| **Static website** | Host a static website directly from a bucket |
| **CORS** | Cross-Origin Resource Sharing configuration |
| **Edge Services** | CDN and WAF add-on for Object Storage buckets |

### Endpoints

| Region | Endpoint |
|---|---|
| Paris | `s3.fr-par.scw.cloud` |
| Amsterdam | `s3.nl-ams.scw.cloud` |
| Warsaw | `s3.pl-waw.scw.cloud` |

### Quickstart

1. In the console, click **Object Storage** in the **Storage** section.
2. Click **+ Create Bucket**.
3. Give the bucket a unique name, select a region, and set the visibility (public/private).
4. Click **Create Bucket**.
5. Upload objects via the console, AWS CLI, or any S3-compatible client.

### S3-Compatible Clients

Scaleway Object Storage works with any S3-compatible tool:
- **AWS CLI:** `aws s3 cp file.txt s3://my-bucket/ --endpoint-url https://s3.fr-par.scw.cloud`
- **s3cmd**, **rclone**, **Cyberduck**, **MinIO Client (mc)**
- SDKs: Python (boto3), JavaScript (aws-sdk), Go (aws-sdk-go)

### Storage Classes

| Class | Description | Use Case |
|---|---|---|
| **Standard** | Low-latency, frequently accessed | Active data |
| **Glacier** | Low-cost, high-retrieval latency | Archives, compliance |

Lifecycle rules can automate transitions from Standard to Glacier.

### Security

- **Bucket policies** (S3-compatible JSON) control access at the bucket level.
- **ACLs** provide per-object access control.
- **Presigned URLs** enable temporary access without exposing credentials.
- Objects can be encrypted server-side.

## 14. Storage — Block Storage

**URL:** https://www.scaleway.com/en/docs/block-storage/

### Overview

Scaleway **Block Storage** provides persistent, network-attached storage volumes that can be plugged into and out of Instances like virtual hard drives. Volumes persist independently of Instances and can be detached and reattached.

### Key Concepts

| Concept | Description |
|---|---|
| **Volume** | A block storage device, provisioned in a specific AZ |
| **IOPS** | Input/Output Operations Per Second — performance metric |
| **Snapshot** | Point-in-time backup of a volume |
| **Attachment** | Connecting a volume to an Instance |
| **Multi-attach** | (Not supported) Each volume can only attach to one Instance at a time |

### Volume Types

| Type | IOPS | Throughput | Use Case |
|---|---|---|---|
| **Block SBS-15K** | 15,000 IOPS | Up to 1 GB/s | High-performance databases |
| **Block SBS-5K** | 5,000 IOPS | Up to 400 MB/s | Standard workloads |
| **Legacy (lssd/bssd)** | Varies | Varies | Older Instance types |

### Quickstart

1. In the console, click **Block Storage** in the **Storage** section.
2. Click **+ Create Volume**.
3. Choose a **type** (SBS-15K or SBS-5K), **size** (GB), and **AZ**.
4. Click **Create Volume**.
5. Attach to an Instance: Go to the Instance, click **Attach Volume**.
6. On the Instance, partition and format the volume:
   ```bash
   lsblk                    # List block devices
   mkfs.ext4 /dev/sdb       # Format
   mount /dev/sdb /mnt/data # Mount
   ```

### Snapshots

- Snapshots are incremental backups of a volume.
- Can be used to create new volumes or restore existing ones.
- Stored in Object Storage internally.

### Differences Between Volume Types

| Aspect | SBS-15K | SBS-5K | Legacy |
|---|---|---|---|
| Max IOPS | 15,000 | 5,000 | Varies |
| Max size | 10 TB | 10 TB | 10 TB |
| Cost | Higher | Standard | Legacy pricing |

## 15. Storage — File Storage

**URL:** https://www.scaleway.com/en/docs/file-storage/

### Overview

Scaleway **File Storage** allows you to create managed file systems that can be shared across multiple Instances within the same region using the NFS (Network File System) protocol. It provides a hierarchical file structure accessible by multiple compute resources simultaneously.

### Key Concepts

| Concept | Description |
|---|---|
| **File system** | A managed NFS file system accessible from multiple Instances |
| **Mount point** | The path where the file system is mounted on an Instance |
| **NFS** | Network File System protocol used for file sharing |
| **Capacity** | File systems scale automatically; you pay for what you use |
| **ReadWriteMany** | Multiple Instances can mount and write simultaneously |

### Quickstart

1. In the console, click **File Storage** in the **Storage** section.
2. Click **+ Create File System**.
3. Select a **region** and give the file system a name.
4. Click **Create**.
5. Mount on an Instance:
   ```bash
   apt install nfs-common
   mount -t nfs <fs-endpoint>:/ /mnt/fs
   ```

### Use Cases

- Shared configuration files across web server clusters.
- Media file storage accessed by multiple processing nodes.
- Shared scratch space for HPC workloads.
- Persistent storage for containerized applications (ReadWriteMany).

### Limitations

- Up to **16 storage resources** (including File Systems, Block Storage, and Local Storage) can be attached to a single Instance.
- File Storage is regional; a file system created in `fr-par` is not accessible from `nl-ams`.

## 16. Databases — Managed Database for PostgreSQL & MySQL

**URL:** https://www.scaleway.com/en/docs/managed-databases-for-postgresql-and-mysql/

### Overview

Scaleway **Managed Database for PostgreSQL and MySQL** provides fully managed relational Database Instances. Scaleway handles provisioning, patching, backups, monitoring, and failover, so you can focus on your application rather than database administration.

### Key Concepts

| Concept | Description |
|---|---|
| **Database Instance** | A managed database server (PostgreSQL or MySQL) |
| **Node type** | The compute resources (vCPU, RAM) of the database Instance |
| **High Availability (HA)** | Automatic failover with a standby replica (optional) |
| **Read replica** | A read-only copy for offloading read traffic |
| **Endpoint** | The connection URL/host for your database |
| **Backup** | Automated daily backups with configurable retention (up to 365 days) |
| **Maintenance window** | Scheduled window for updates and patches |
| **Encryption at rest** | Data on disk is encrypted (optional, via Key Manager) |
| **Private Network** | Database accessible only via a Private Network (no public IP) |
| **Extensions** | Additional PostgreSQL extensions that can be enabled per database |

### Supported Engines & Versions

| Engine | Supported Versions |
|---|---|
| **PostgreSQL** | 12, 13, 14, 15, 16 |
| **MySQL** | 8.0 |

### Quickstart

1. In the console, click **Managed Databases** in the **Databases** section.
2. Click **+ Create Database Instance**.
3. Select the **engine** (PostgreSQL or MySQL) and **version**.
4. Choose a **node type** (e.g., DB-DEV-S, DB-GP-M, DB-MEM-L).
5. Configure **storage size**, **HA mode**, and **backup retention**.
6. Configure **network** (public or Private Network endpoint).
7. Set an **admin username and password**.
8. Click **Create Database Instance**.
9. Connect: `psql "postgresql://admin:<password>@<endpoint>:5432/<db-name>"`

### Node Types

| Category | Examples | RAM | Use Case |
|---|---|---|---|
| Development | DB-DEV-S, DB-DEV-M | 1–8 GB | Dev/test |
| General Purpose | DB-GP-S, DB-GP-M, DB-GP-L | 4–32 GB | Production workloads |
| Memory Optimized | DB-MEM-L, DB-MEM-XL | 64–256 GB | In-memory intensive |

### High Availability

- In HA mode, a **standby replica** is maintained in a separate AZ.
- Failover is automatic: if the primary fails, the standby is promoted within seconds.
- The connection endpoint remains the same after failover.

### Monitoring

- Database metrics (CPU, RAM, IOPS, connections) are available via **Cockpit**.
- Pre-built Grafana dashboards: **RDB MySQL Overview** and **RDB PostgreSQL Overview**.

## 17. Databases — Managed Database for Redis™

**URL:** https://www.scaleway.com/en/docs/managed-databases-for-redis/

### Overview

Scaleway **Managed Database for Redis™** is a low-latency, in-memory caching and data store solution. It handles the complexity of Redis setup, configuration, and maintenance, making it easy to add a fast cache layer to your applications.

> **Note:** Redis™ is a trademark of Redis Ltd. Scaleway's Managed Database for Redis is compatible with the Redis protocol and uses the open-source Redis engine.

### Key Concepts

| Concept | Description |
|---|---|
| **Redis Instance** | A managed Redis in-memory database |
| **Cluster mode** | Redis Cluster for horizontal scaling and sharding |
| **Standalone mode** | Single-node Redis for simple use cases |
| **Persistence** | Optional RDB (snapshot) or AOF (append-only file) persistence |
| **Eviction policy** | Strategy for removing keys when memory is full (e.g., `allkeys-lru`) |
| **TLS** | Encryption in transit (enabled by default) |
| **ACL** | Access Control Lists for per-user permission management |

### Use Cases

- **Session caching:** Store user sessions for fast web application access.
- **Real-time leaderboards:** Sorted sets for gaming or ranking applications.
- **Rate limiting:** Atomic counters for API rate limiting.
- **Pub/Sub messaging:** Lightweight pub/sub between application components.
- **Temporary data:** Short-lived key-value storage with TTL.

### Quickstart

1. In the console, click **Managed Databases for Redis** in the **Databases** section.
2. Click **+ Create a Redis™ Database Instance**.
3. Choose a **version** (e.g., Redis 7), **node type**, and **cluster mode** (standalone or cluster).
4. Configure **TLS** and **persistence** settings.
5. Set an **admin password**.
6. Click **Create**.
7. Connect: `redis-cli -h <endpoint> -p 6379 -a <password> --tls`

### Data Persistence

> Scaleway Managed Database for Redis is primarily suited for **caching** use cases. While persistence (RDB/AOF) is available, it does not replace a full persistent database.

- **RDB (Snapshotting):** Periodic snapshots saved to disk.
- **AOF (Append-Only File):** Every write command is logged for durability.

## 18. Databases — Managed MongoDB®

**URL:** https://www.scaleway.com/en/docs/managed-mongodb-databases/

### Overview

Scaleway **Managed MongoDB®** provides fully managed document Database Instances with MongoDB® as the database engine. It handles provisioning, backups, monitoring, and upgrades, letting you focus on your application data model.

> **Note:** MongoDB® is a registered trademark of MongoDB, Inc.

### Key Concepts

| Concept | Description |
|---|---|
| **Database Instance** | A managed MongoDB server |
| **Replica Set** | A group of MongoDB instances maintaining the same data for high availability |
| **Collection** | MongoDB's equivalent of a table; a group of documents |
| **Document** | A BSON/JSON record within a collection |
| **User** | A MongoDB user with roles defining access to databases/collections |
| **Endpoint** | The MongoDB connection URI |

### Supported Versions

- MongoDB® 7.0
- MongoDB® 6.0

### Quickstart

1. In the console, click **Managed MongoDB®** in the **Databases** section.
2. Click **+ Create Database Instance**.
3. Select a **version**, **node type**, and **storage size**.
4. Configure **network** settings (public or Private Network).
5. Create an initial **admin user**.
6. Click **Create**.
7. Connect: `mongosh "mongodb://admin:<password>@<endpoint>:27017/admin?tls=true"`

### User Management

MongoDB users are assigned roles such as:
- `readWrite` — Read and write access to a specific database.
- `dbAdmin` — Administrative actions on a specific database.
- `clusterAdmin` — Cluster-level administrative access.
- Global roles can also be set for cross-database access.

## 19. Databases — OpenSearch

**URL:** https://www.scaleway.com/en/docs/opensearch/

### Overview

Scaleway **Cloud Essentials for OpenSearch** is a managed OpenSearch deployment service. OpenSearch is an open-source distributed search and analytics engine (a fork of Elasticsearch), suitable for full-text search, log analytics, and observability.

### Key Concepts

| Concept | Description |
|---|---|
| **Deployment** | A managed OpenSearch cluster |
| **Node** | An individual OpenSearch server within a deployment |
| **Index** | The basic unit of data storage in OpenSearch |
| **Shard** | A subdivision of an index for horizontal scaling |
| **Replica** | A copy of a shard for fault tolerance |
| **Dashboard** | OpenSearch Dashboards UI for data visualization |
| **Private Network** | Isolate the deployment from the public internet |

### Quickstart

1. In the console, click **OpenSearch** in the **Databases** section.
2. Click **+ Create Deployment**.
3. Choose a **version**, **node type**, and number of nodes.
4. Configure **storage** and optionally a **Private Network**.
5. Click **Create Deployment**.
6. Access via the **OpenSearch Dashboards** URL or REST API endpoint.

### Use Cases

- **Log aggregation & analysis:** Ingest and query application/system logs.
- **Full-text search:** Power search functionality in applications.
- **Security analytics:** SIEM-like security event correlation.
- **Observability:** Store and visualize metrics and traces.

## 20. Networking — VPC & Private Networks

**URL:** https://www.scaleway.com/en/docs/vpc/

### Overview

Scaleway **VPC (Virtual Private Cloud)** allows you to build an isolated, private network on top of Scaleway's shared public cloud. Within each VPC, you can create multiple **Private Networks** to interconnect your resources (Instances, Databases, Kubernetes nodes, Elastic Metal, etc.) securely, without exposing traffic to the public internet.

### Key Concepts

| Concept | Description |
|---|---|
| **VPC** | A regional, isolated virtual network environment |
| **Private Network** | A Layer 2 network segment within a VPC |
| **CIDR** | The IP address range assigned to a Private Network |
| **DHCP** | Automatically assigns IP addresses to resources on the Private Network |
| **Managed DNS** | Automatic DNS resolution for resource hostnames within a VPC |
| **Routing** | Traffic routing between Private Networks within the same VPC |
| **Attach** | Adding a resource (Instance, DB, LB) to a Private Network |
| **MAC address** | Each resource attachment gets a unique MAC address |

### VPC vs. Private Network

| Level | Scope | Purpose |
|---|---|---|
| **VPC** | Regional | Container for Private Networks; handles routing between them |
| **Private Network** | Subnet within a VPC | Layer 2 network connecting specific resources |

### Quickstart

1. In the console, click **VPC** in the **Network** section.
2. A **default VPC** is created per region automatically.
3. Click **+ Create Private Network** within the VPC.
4. Set a **name** and **CIDR block** (or let Scaleway auto-assign).
5. Attach resources (Instances, databases, etc.) to the Private Network.
6. Resources communicate using their private IP addresses.

### Managed DNS

VPC includes managed DNS for Private Networks:
- Scaleway resources get a DNS hostname automatically.
- Hostname format: `<resource-name>.<private-network-name>.internal`
- Enables service discovery within the VPC.

### Best Practices

- Use Private Networks for all inter-service communication to reduce public internet exposure.
- Place databases on Private Networks only (no public endpoint).
- Use CIDR ranges that don't overlap between networks.
- Enable DHCP for automatic IP management.

## 21. Networking — Public Gateways

**URL:** https://www.scaleway.com/en/docs/public-gateways/

### Overview

Scaleway **Public Gateways** sit at the border of Private Networks and provide resources with a secure, managed point of access to and from the public internet. They enable resources without public IPs to access the internet and allow external services to reach them.

### Key Concepts

| Concept | Description |
|---|---|
| **Public Gateway** | A managed NAT/VPN gateway attached to a Private Network |
| **NAT (Network Address Translation)** | Allows private resources to initiate outbound internet connections |
| **PAT (Port Address Translation)** | Maps specific external ports to internal resources (inbound access) |
| **SSH Bastion** | Jump host functionality for SSH access to private resources |
| **Flexible IP** | The public IP address assigned to the gateway |
| **DHCP** | The gateway can serve as a DHCP server for the Private Network |

### Features

- **Outbound NAT:** Resources on a Private Network can access the internet through the gateway's public IP.
- **Inbound PAT:** External traffic on specific ports is forwarded to specific private resources.
- **SSH Bastion:** Connect to private Instances via the gateway using SSH jump host.
- **VPN:** The gateway supports VPN connections (IPSec) for secure site-to-site tunnels.

### Quickstart

1. Click **Public Gateways** in the **Network** section of the console.
2. Click **+ Create Public Gateway**.
3. Select a **region**, **type**, and assign a **Flexible IP**.
4. Attach the gateway to a **Private Network**.
5. Resources on that Private Network can now access the internet via NAT.

### PAT Rules

PAT rules forward inbound traffic from the gateway's public IP to specific private resources:
- Example: Public port 8080 → Private IP 192.168.0.10:80

### SSH Bastion

The SSH Bastion feature lets you SSH into private Instances via the gateway:
```bash
ssh -J user@<gateway-ip> user@<private-instance-ip>
```

## 22. Networking — Load Balancers

**URL:** https://www.scaleway.com/en/docs/load-balancer/

### Overview

Scaleway **Load Balancers** distribute incoming traffic across multiple backend servers, providing high availability and horizontal scalability. They support both HTTP/HTTPS and TCP traffic.

### Key Concepts

| Concept | Description |
|---|---|
| **Frontend** | The listener configuration (IP, port, protocol) |
| **Backend** | The pool of backend servers and load balancing settings |
| **Backend server** | An individual server in the backend pool |
| **Health check** | Periodic probe to determine if a backend server is healthy |
| **Algorithm** | How traffic is distributed (round-robin, least-connections, first) |
| **ACL** | Access Control List for traffic filtering rules |
| **Sticky session** | Routing requests from the same client to the same backend (cookie-based) |
| **SSL termination** | Decrypting HTTPS at the Load Balancer level |
| **SSL bridging** | Re-encrypting traffic from LB to backend |
| **Flexible IP** | The public IP(s) assigned to the Load Balancer |
| **Private Network** | LB can communicate with backends via a Private Network |

### Quickstart

1. Click **Load Balancers** in the **Network** section.
2. Click **+ Create Load Balancer**.
3. Choose a **region**, **type** (small, medium, large), and assign a **Flexible IP**.
4. Create a **frontend** (e.g., port 443, HTTPS, with SSL certificate).
5. Create a **backend** (e.g., port 80, HTTP round-robin) and add backend server IPs.
6. Configure **health checks** (HTTP GET `/health` returning 200, for example).
7. Click **Create Load Balancer**.

### Load Balancing Algorithms

| Algorithm | Description |
|---|---|
| **Round Robin** | Requests distributed evenly in order |
| **Least Connections** | Requests go to the server with fewest active connections |
| **First** | First available server receives all traffic until it reaches capacity |

### TLS/SSL Options

| Mode | Description |
|---|---|
| **SSL Termination** | HTTPS terminated at the LB; HTTP to backends |
| **SSL Passthrough** | Encrypted traffic passed directly to backends (no inspection) |
| **SSL Bridging** | Terminate at LB, re-encrypt to backends |

### Resizing

Load Balancers can be resized (up or down) without downtime, allowing you to adjust capacity based on traffic.

### Integration with Kubernetes

When a Kubernetes Service of type `LoadBalancer` is created in Kapsule, Scaleway automatically provisions a Load Balancer and configures it. Annotations allow fine-grained control of the LB configuration.

### Monitoring

Load Balancer metrics (requests/sec, latency, error rate, backend health) are available in **Cockpit**.

## 23. Networking — Edge Services

**URL:** https://www.scaleway.com/en/docs/edge-services/

### Overview

Scaleway **Edge Services** is an additional managed service for **Load Balancers** and **Object Storage buckets**. It adds a CDN-like caching layer and Web Application Firewall (WAF) at the edge, improving performance and security for your services.

### Key Concepts

| Concept | Description |
|---|---|
| **Pipeline** | An Edge Services configuration for an LB or Object Storage origin |
| **Cache** | Stores responses at the edge to reduce origin load and latency |
| **WAF (Web Application Firewall)** | Filters malicious traffic before it reaches your origin |
| **Origin** | The backend source (Load Balancer or Object Storage bucket) |
| **Stage** | A step in the Edge Services pipeline (backend, cache, WAF, TLS) |
| **Subscription plan** | Required to use Edge Services; determines pipeline count and features |

### Pipeline Components

1. **Backend stage:** Connects to your Load Balancer or Object Storage bucket.
2. **Cache stage:** Configures cache TTL, cache keys, and bypass rules.
3. **WAF stage:** Enables OWASP-based web application firewall rules.
4. **TLS stage:** Manages TLS certificates for the edge endpoint.

### Quickstart

1. In the console, click **Edge Services**.
2. On the **Plans** tab, select and activate a subscription plan.
3. Click **+ Create Pipeline**.
4. Select the origin type (**Load Balancer** or **Object Storage**).
5. Select the specific LB or bucket as the origin.
6. Configure **cache** settings (TTL, cache keys).
7. Optionally enable **WAF**.
8. Configure **TLS** (custom domain and certificate).
9. Click **Create Pipeline**.

### Caching

- Cache TTL is configurable per path/rule.
- Cache can be bypassed using custom rules (e.g., skip cache for authenticated requests).
- Cache invalidation (purge) is available via the API.

## 24. Networking — Domains and DNS

**URL:** https://www.scaleway.com/en/docs/domains-and-dns/

### Overview

Scaleway **Domains and DNS** is a managed DNS service. It allows you to:

- **Register new domain names** (internal domains managed by Scaleway).
- **Transfer existing domain names** from other registrars.
- **Manage DNS zones** for both internal (Scaleway-registered) and external domains.

### Key Concepts

| Concept | Description |
|---|---|
| **Domain** | A human-readable address (e.g., `example.com`) |
| **Internal domain** | A domain registered/transferred to Scaleway |
| **External domain** | A domain registered elsewhere, with DNS managed by Scaleway |
| **DNS zone** | The authoritative database for a domain's DNS records |
| **DNS record** | An entry in a DNS zone (A, AAAA, CNAME, MX, TXT, etc.) |
| **Nameserver** | The DNS server authoritative for a zone |
| **DNSSEC** | DNS Security Extensions to sign zone data and prevent spoofing |
| **Autorenew** | Automatic domain renewal before expiry |
| **TTL** | Time-to-live; how long a DNS record is cached by resolvers |

### Supported Record Types

| Type | Purpose |
|---|---|
| **A** | IPv4 address |
| **AAAA** | IPv6 address |
| **CNAME** | Alias for another domain |
| **MX** | Mail server |
| **TXT** | Text records (SPF, DKIM, DMARC, ownership verification) |
| **NS** | Nameserver delegation |
| **SRV** | Service discovery |
| **CAA** | Certificate Authority Authorization |
| **ALIAS** | CNAME-like record for apex domains |

### How-Tos

- **Register a domain:** Navigate to **Domains & DNS**, click **+ Register a Domain**, search for availability, and complete the registration.
- **Transfer a domain:** Obtain the transfer authorization (EPP/Auth code) from your current registrar, then initiate the transfer in the Scaleway console.
- **Configure autorenew:** Toggle autorenew in domain settings.
- **Configure DNS records:** Navigate to the domain's DNS zone and add/edit records.
- **Enable DNSSEC:** Navigate to DNSSEC settings and follow the activation steps.
- **Add an external domain:** Add a domain whose registrar is elsewhere; Scaleway's nameservers manage the DNS zone.

### Advanced Traffic Management

Scaleway's DNS supports advanced traffic management using:
- **Weighted records:** Distribute traffic proportionally between multiple endpoints.
- **Geo-based routing:** Route users to the nearest endpoint based on their location.

## 25. Networking — IPAM

**URL:** https://www.scaleway.com/en/docs/ipam/

### Overview

Scaleway **IPAM (IP Address Manager)** is a tool for planning, tracking, and managing the IP address space of Scaleway products. It provides visibility into IP allocations across your Private Networks and public resources.

### Key Concepts

| Concept | Description |
|---|---|
| **IP address** | An IPv4 or IPv6 address allocated to a Scaleway resource |
| **Private IP** | An IP address within a Private Network |
| **Public IP** | A publicly routable IP address |
| **Flexible IP** | A portable public IP that can be moved between resources |
| **Reserved IP** | An IP address allocated but not yet assigned to a resource |

### How-Tos

- **View IP allocations:** Navigate to **IPAM** to see all IP addresses allocated across your Projects.
- **Reserve an IP:** Allocate an IP in advance before attaching it to a resource.
- **Manage Flexible IPs:** Detach from one resource and reattach to another without changing the IP.

### Best Practices for Public Connectivity

- Use **Flexible IPs** for services that need a stable public IP (failover, DNS A records).
- Place databases behind Private Networks with a Public Gateway for outbound access.
- Use **Security Groups** to restrict inbound traffic to Instances.
- Consider **NAT** via Public Gateways instead of assigning public IPs to every resource.

## 26. AI — Generative APIs

**URL:** https://www.scaleway.com/en/docs/generative-apis/

### Overview

Scaleway **Generative APIs** provide easy, serverless access to open-source AI language and embedding models hosted on Scaleway's infrastructure. The API is OpenAI-compatible, making it easy to integrate with existing tools and SDKs. No GPU management required — pay per token.

### Key Concepts

| Concept | Description |
|---|---|
| **Language model** | A large AI model for text generation, chat, and instruction-following |
| **Embedding model** | A model that converts text into vector representations for semantic search |
| **Token** | The basic unit of text processed by AI models |
| **Chat completion** | API endpoint for conversational AI interactions |
| **Streaming** | Streaming responses token-by-token for real-time output |
| **Structured output** | Models can return responses in a specified JSON schema |
| **Tool calling** | Models can call external functions/APIs during generation |
| **Context window** | The maximum number of tokens a model can process in one request |

### Supported Models (Examples)

| Model | Type | Context Window |
|---|---|---|
| Llama 3.1 8B Instruct | Chat | 128K |
| Llama 3.1 70B Instruct | Chat | 128K |
| Llama 3.1 405B Instruct | Chat | 128K |
| Llama 3.3 70B | Chat | 128K |
| Mistral 7B Instruct | Chat | 32K |
| Mixtral 8x7B Instruct | Chat | 32K |
| Pixtral 12B | Multimodal | 128K |
| BAAI/bge-multilingual | Embedding | 8K |

*(Full model list available at:* https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/ *)*

### Quickstart

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.scaleway.ai/v1",
    api_key="<SCALEWAY_API_KEY>"
)

response = client.chat.completions.create(
    model="llama-3.1-8b-instruct",
    messages=[{"role": "user", "content": "What is Scaleway?"}],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content, end="", flush=True)
```

### Compatible Tools

- **OpenAI Python SDK / JavaScript SDK** (using `base_url` override)
- **LangChain** (OpenAI-compatible integration)
- **LlamaIndex**
- **LiteLLM**
- **AnythingLLM**
- **Ollama** (via API redirection)

### Endpoints

| Capability | Endpoint |
|---|---|
| Chat completions | `POST https://api.scaleway.ai/v1/chat/completions` |
| Embeddings | `POST https://api.scaleway.ai/v1/embeddings` |
| Models list | `GET https://api.scaleway.ai/v1/models` |

## 27. AI — Managed Inference

**URL:** https://www.scaleway.com/en/docs/managed-inference/

### Overview

Scaleway **Managed Inference** lets you deploy AI/ML models on dedicated GPU infrastructure with a managed, production-ready endpoint. Unlike the serverless Generative APIs, Managed Inference gives you a **dedicated deployment** — ideal when you need consistent performance, custom models, or data privacy guarantees.

### Key Concepts

| Concept | Description |
|---|---|
| **Deployment** | A running model instance with a dedicated endpoint |
| **Model** | An AI/ML model from Scaleway's catalog or imported from Hugging Face/Object Storage |
| **Endpoint** | The HTTPS URL for sending inference requests |
| **Node type** | The GPU hardware backing the deployment |
| **Quantization** | Reducing model precision (e.g., INT8, INT4) to fit larger models on smaller GPUs |
| **Custom model** | A user-provided model (from Hugging Face or Object Storage) |
| **Private endpoint** | An endpoint accessible only via a Private Network |

### Supported Model Sources

1. **Scaleway model catalog:** Curated, pre-optimized models ready to deploy.
2. **Hugging Face:** Import directly from Hugging Face Hub.
3. **Object Storage:** Import a model stored in a Scaleway Object Storage bucket.

### Supported Model Types (Examples)

- Text generation / chat (Llama, Mistral, Falcon, etc.)
- Text embeddings
- Image generation (Stable Diffusion, SDXL)
- Speech-to-text (Whisper)
- Custom fine-tuned models

### Quickstart

1. In the console, click **Managed Inference** in the **AI** section.
2. Click **+ Create Deployment**.
3. Choose a **model** from the catalog (or import a custom model).
4. Select a **GPU node type** (e.g., L4, H100).
5. Configure **endpoint access** (public or private).
6. Click **Deploy**.
7. Once deployed, send inference requests to the endpoint URL.

### Monitoring

Managed Inference deployments can be monitored via Cockpit:
- Requests per second
- Latency (TTFT — time to first token)
- GPU utilization
- Error rates

### Changing a Model

You can hot-swap the model on an existing deployment without downtime by selecting a new model from the catalog in the deployment settings.

## 28. Messaging — Queues (SQS-compatible)

**URL:** https://www.scaleway.com/en/docs/queues/

### Overview

Scaleway **Queues** is a managed message queue service compatible with the **Amazon SQS (Simple Queue Service)** protocol. It allows you to decouple microservices and application components by enabling asynchronous, reliable message passing.

### Key Concepts

| Concept | Description |
|---|---|
| **Queue** | A named FIFO or standard message queue |
| **Message** | A unit of data sent between producers and consumers |
| **Producer** | The service/app that sends messages to a queue |
| **Consumer** | The service/app that reads and processes messages |
| **Standard queue** | At-least-once delivery; messages may be received out of order |
| **FIFO queue** | Exactly-once delivery; strict message ordering |
| **Visibility timeout** | Duration a message is hidden from other consumers after being read |
| **Dead-letter queue (DLQ)** | A queue for messages that repeatedly fail processing |
| **Retention period** | How long messages are kept before being deleted |
| **Long polling** | Reduces empty responses by waiting for messages to arrive |

### Quickstart

```python
import boto3

sqs = boto3.client(
    "sqs",
    endpoint_url="https://sqs.mnq.fr-par.scaleway.com",
    region_name="fr-par",
    aws_access_key_id="<ACCESS_KEY>",
    aws_secret_access_key="<SECRET_KEY>"
)

# Create a queue
response = sqs.create_queue(QueueName="my-queue")
queue_url = response["QueueUrl"]

# Send a message
sqs.send_message(QueueUrl=queue_url, MessageBody="Hello, Scaleway!")

# Receive messages
msgs = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=10)
```

### SQS API Compatibility

Scaleway Queues supports the core SQS API, including:
- `CreateQueue`, `DeleteQueue`, `ListQueues`
- `SendMessage`, `ReceiveMessage`, `DeleteMessage`
- `GetQueueAttributes`, `SetQueueAttributes`
- Dead-letter queue configuration

## 29. Messaging — NATS

**URL:** https://www.scaleway.com/en/docs/nats/

### Overview

Scaleway **NATS** is a managed messaging service based on the open-source **NATS.io** messaging system. NATS supports multiple messaging patterns and is designed for high-performance, cloud-native applications.

### Key Concepts

| Concept | Description |
|---|---|
| **NATS account** | A logical namespace for NATS subjects and streams |
| **Subject** | A named channel for publishing and subscribing to messages |
| **Publisher** | A client that sends messages to a subject |
| **Subscriber** | A client that receives messages from a subject |
| **JetStream** | NATS's persistent messaging layer for at-least-once delivery |
| **Stream** | A persistent log of messages in JetStream |
| **Consumer** | A named subscription to a JetStream stream |
| **Queue group** | Load balancing across multiple subscribers |
| **Core NATS** | Fire-and-forget pub/sub (no persistence) |

### Messaging Patterns

| Pattern | Description |
|---|---|
| **Pub/Sub** | One-to-many message broadcasting |
| **Request/Reply** | Synchronous-style messaging over async channel |
| **Queue Group** | Load-balanced message distribution |
| **JetStream** | Persistent, at-least-once message delivery with replay |

### Quickstart

1. In the console, click **NATS** in the **Messaging** section.
2. Click **+ Create NATS Account**.
3. Generate credentials (NATS credentials file).
4. Connect with a NATS client:
   ```bash
   nats pub --creds=./nats.creds subject "Hello NATS"
   nats sub --creds=./nats.creds subject
   ```

## 30. Messaging — Transactional Email

**URL:** https://www.scaleway.com/en/docs/transactional-email/

### Overview

Scaleway **Transactional Email (TEM)** is a platform for sending application-generated transactional emails such as receipts, alerts, password resets, notifications, and other automated emails. It provides high deliverability through proper email authentication setup.

### Key Concepts

| Concept | Description |
|---|---|
| **Sending domain** | A verified domain used as the sender address |
| **SPF** | Sender Policy Framework DNS record to authorize sending servers |
| **DKIM** | DomainKeys Identified Mail — cryptographic email signing |
| **DMARC** | Domain-based Message Authentication, Reporting & Conformance |
| **SMTP** | Send emails via standard SMTP protocol |
| **API** | Send emails programmatically via the Transactional Email REST API |
| **Email logs** | History of sent emails with delivery status |
| **Bounce** | An email that could not be delivered to the recipient |

### Quickstart

1. In the console, click **Transactional Email** in the **Messaging** section.
2. Click **+ Add Domain** and enter your domain.
3. Configure **SPF**, **DKIM**, and **DMARC** records in your DNS zone.
4. Verify the domain.
5. Send a test email via SMTP or API.

### Sending via SMTP

```
SMTP Host: smtp.tem.scw.cloud
Port: 587 (STARTTLS) or 465 (SSL)
Username: <your-scaleway-project-id>
Password: <your-scaleway-secret-key>
```

### Sending via API

```bash
curl -X POST https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails \
  -H "X-Auth-Token: <SCW_SECRET_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "from": {"email": "no-reply@yourdomain.com", "name": "My App"},
    "to": [{"email": "user@example.com"}],
    "subject": "Hello!",
    "html": "<h1>Welcome</h1>",
    "project_id": "<PROJECT_ID>"
  }'
```

### Capabilities & Limits

- Maximum email size: 2 MB
- Maximum recipients per request: multiple (configurable)
- Attachments supported
- Monitored deliverability with bounce tracking

## 31. Observability — Cockpit

**URL:** https://www.scaleway.com/en/docs/cockpit/

### Overview

Scaleway **Cockpit** is the managed observability platform for all Scaleway resources. It provides **metrics**, **logs**, and **traces** collection, storage, and visualization — powered by Grafana and the LGTM (Loki, Grafana, Tempo, Mimir) stack.

### Key Concepts

| Concept | Description |
|---|---|
| **Cockpit** | The central observability hub for a Scaleway Project |
| **Metrics** | Time-series numerical data (CPU usage, request count, etc.) |
| **Logs** | Text records of events from applications and infrastructure |
| **Traces** | Distributed tracing for request flows across services |
| **Grafana** | Open-source visualization platform embedded in Cockpit |
| **Mimir** | Long-term metrics storage backend |
| **Loki** | Log aggregation and query backend |
| **Tempo** | Distributed tracing backend |
| **Push token** | Credential for sending custom metrics/logs/traces to Cockpit |
| **Alerting rule** | A condition that triggers an alert when met |
| **Alert manager** | Handles alert routing and notification (e.g., email, Slack) |

### What Cockpit Monitors (Native Integration)

Many Scaleway products automatically push metrics and logs to Cockpit:

- **Instances** — CPU, RAM, disk, network metrics
- **Kubernetes (Kapsule/Kosmos)** — Node and pod metrics, logs
- **Managed Databases** — Query performance, connections, replication lag
- **Load Balancers** — Request rates, latency, backend health
- **Managed Inference** — GPU utilization, request rates, latency
- **Serverless Functions/Containers/Jobs** — Invocation counts, duration, errors
- **Object Storage** — Request counts, bandwidth

### Quickstart

1. In the console, click **Cockpit** in the **Observability** section.
2. Click **Open Grafana**.
3. Create **Grafana credentials** (username + password) to log in.
4. Use pre-built dashboards (e.g., "RDB PostgreSQL Overview", "Kapsule Overview").
5. To push **custom metrics/logs**, create a **push token** and configure your agent:
   - Prometheus `remote_write` for metrics
   - Promtail / Loki agent for logs
   - OpenTelemetry Collector for traces

### Alerting

1. In Grafana, navigate to **Alerting > Alert Rules**.
2. Create alert rules based on metric queries.
3. Configure **contact points** (email, Slack, PagerDuty, webhook).
4. Set up **notification policies** to route alerts to the right contact.

## 32. Security — Secret Manager

**URL:** https://www.scaleway.com/en/docs/secret-manager/

### Overview

Scaleway **Secret Manager** is a managed service for securely storing, accessing, and sharing sensitive information such as API keys, passwords, certificates, and configuration strings. Secrets are version-controlled and access-controlled via IAM.

### Key Concepts

| Concept | Description |
|---|---|
| **Secret** | A named container for sensitive data (one or more versions) |
| **Version** | A specific iteration of a secret's value |
| **Path** | A hierarchical namespace for organizing secrets (like folders) |
| **Ephemeral policy** | Auto-delete a secret version after it's accessed or after a time-to-live |
| **Secret type** | The format of the secret (opaque, key/value, certificate, basic credentials) |
| **Access** | Controlled via IAM policies |
| **Rotation** | Updating a secret value by creating a new version |

### Secret Types

| Type | Description |
|---|---|
| **Opaque** | Raw bytes (e.g., a binary key, arbitrary data) |
| **Key/Value** | Structured key-value pairs (e.g., JSON config) |
| **Certificate** | TLS certificate and private key pair |
| **Basic credentials** | Username and password pair |

### Quickstart

1. In the console, click **Secret Manager** in the **Security** section.
2. Click **+ Create Secret**.
3. Enter a **name** and optionally a **path** (e.g., `/production/database/password`).
4. Choose a **secret type** and enter the value.
5. Optionally configure an **ephemeral policy**.
6. Click **Create Secret**.
7. Add additional **versions** as needed.

### Accessing Secrets Programmatically

```bash
# Using Scaleway CLI
scw secret secret get-value <secret-id> --stage=enabled
```

```python
# Using Scaleway Python SDK
from scaleway import Client
from scaleway.secret.v1beta1 import SecretV1Beta1API

client = Client(secret_key="<SCW_SECRET_KEY>", default_region="fr-par")
api = SecretV1Beta1API(client)
value = api.access_secret_version(secret_id="<id>", revision="latest")
```

### Integration with Key Manager

Secret Manager can use **Key Manager** (KMS) keys to encrypt secret values at rest. When a Key Manager key is associated with a secret, the secret's value is encrypted using that key, adding a hardware-backed encryption layer.

## 33. Security — Key Manager

**URL:** https://www.scaleway.com/en/docs/key-manager/

### Overview

Scaleway **Key Manager (KMS)** is a managed cryptographic key service. It allows you to generate, store, and use cryptographic keys for encryption and decryption operations without exposing the keys themselves. Key Manager supports both **symmetric** and **asymmetric** keys.

### Key Concepts

| Concept | Description |
|---|---|
| **Key** | A cryptographic key managed by Key Manager |
| **KEK (Key Encryption Key)** | A key used to encrypt/decrypt other keys; never leaves Key Manager |
| **DEK (Data Encryption Key)** | A key generated by Key Manager that can be used externally to encrypt data |
| **Symmetric key** | A single key for both encryption and decryption (AES-256) |
| **Asymmetric key** | A public/private key pair (RSA, ECDSA) |
| **Key state** | Enabled, disabled, or scheduled for deletion |
| **Rotation** | Creating a new key version while retaining the ability to decrypt old data |

### Key Types

| Type | Algorithm | Use Case |
|---|---|---|
| **Symmetric** | AES-256-GCM | Encryption at rest, envelope encryption |
| **Asymmetric (Encryption)** | RSA-OAEP 2048/3072/4096, RSA-PKCS1v1.5 | Encrypt data with public key |
| **Asymmetric (Signing)** | ECDSA P-256/P-384, RSA-PSS, RSA-PKCS1v1.5 | Digital signatures |

### Quickstart

1. In the console, click **Key Manager** in the **Security** section.
2. Click **+ Create Key**.
3. Enter a **name** and select a **usage** (encrypt/decrypt, sign/verify).
4. Select an **algorithm** (e.g., `aes_256_gcm`, `rsa_oaep_4096_sha256`).
5. Click **Create Key**.
6. Use the API to encrypt or decrypt data using the key.

### Envelope Encryption Pattern

Key Manager supports **envelope encryption**:
1. Key Manager generates a **DEK** (Data Encryption Key).
2. Your application uses the DEK to encrypt data locally.
3. The DEK (in encrypted form) is stored alongside the encrypted data.
4. To decrypt: send the encrypted DEK to Key Manager → receive the plaintext DEK → decrypt data locally.

This ensures the actual data encryption key is never stored in plaintext anywhere.

## 34. Security — Audit Trail

**URL:** https://www.scaleway.com/en/docs/audit-trail/

### Overview

Scaleway **Audit Trail** is a record-keeping service that logs events and changes performed within a Scaleway Organization. It provides an immutable record of user actions, API calls, and system events for compliance, security auditing, and operational troubleshooting.

### Key Concepts

| Concept | Description |
|---|---|
| **Event** | A logged action (e.g., "Create Instance", "Delete S3 object") |
| **Actor** | The user, application, or service that performed the action |
| **Resource** | The Scaleway resource affected by the event |
| **Event type** | The category of action (create, read, update, delete) |
| **Retention** | How long events are kept in Audit Trail |
| **Export** | Ability to export events to Object Storage or external SIEM |

### Integrated Products

Audit Trail captures events from many Scaleway products, including:
- IAM (user logins, policy changes, API key creation)
- Instances (create, start, stop, delete)
- Object Storage (bucket creation, object deletion, policy changes)
- Databases (instance creation, user management)
- Kubernetes (cluster operations)
- Secret Manager (secret access)
- And many more…

### Quickstart

1. In the console, click **Audit Trail** in the **Security** section.
2. Browse recent events in the event log.
3. Filter by **resource type**, **actor**, **event type**, or **date range**.
4. Export events to Object Storage for long-term retention or SIEM ingestion.

### Use Cases

- **Compliance:** Demonstrate to auditors who did what and when.
- **Security investigations:** Identify unauthorized access or suspicious activity.
- **Operational debugging:** Trace the cause of unexpected resource changes.

## 35. Container Registry

**URL:** https://www.scaleway.com/en/docs/container-registry/

### Overview

Scaleway **Container Registry** is a fully managed, mutualized container image registry designed for storing, managing, and deploying container images. It is tightly integrated with Scaleway's Kubernetes and Serverless services.

### Key Concepts

| Concept | Description |
|---|---|
| **Namespace** | A named registry namespace (e.g., `rg.fr-par.scw.cloud/my-namespace`) |
| **Image** | A Docker/OCI container image stored in the registry |
| **Tag** | A labeled version of an image (e.g., `latest`, `v1.2.3`) |
| **Privacy** | Registry namespaces can be public or private |
| **Image scanning** | Security scanning for known vulnerabilities in images |

### Quickstart

```bash
# 1. Login to the Scaleway Container Registry
docker login rg.fr-par.scw.cloud -u nologin -p <SCW_SECRET_KEY>

# 2. Tag your image
docker tag my-app:latest rg.fr-par.scw.cloud/my-namespace/my-app:latest

# 3. Push to the registry
docker push rg.fr-par.scw.cloud/my-namespace/my-app:latest

# 4. Pull from the registry
docker pull rg.fr-par.scw.cloud/my-namespace/my-app:latest
```

### Registry Endpoints by Region

| Region | Endpoint |
|---|---|
| Paris | `rg.fr-par.scw.cloud` |
| Amsterdam | `rg.nl-ams.scw.cloud` |
| Warsaw | `rg.pl-waw.scw.cloud` |

### Integration with Kubernetes

When using Scaleway Kapsule/Kosmos, the Container Registry is automatically accessible from cluster nodes without additional authentication configuration (same account).

### Privacy Settings

- **Public namespace:** Images are accessible without authentication (pull only).
- **Private namespace:** Authentication required to push or pull images.

## 36. IoT Hub

**URL:** https://www.scaleway.com/en/docs/iot-hub/

### Overview

Scaleway **IoT Hub** is a managed message broker designed to connect and manage thousands of IoT devices. It supports the most popular IoT protocols and enables bidirectional communication between devices, applications, and cloud services using a publish/subscribe pattern.

### Supported Protocols

| Protocol | Description |
|---|---|
| **MQTT** | Lightweight pub/sub protocol for constrained IoT devices |
| **MQTTs** | MQTT over TLS (secure) |
| **MQTT over WebSocket** | MQTT in browsers via WebSocket |
| **Sigfox** | Low-power wide-area network for long-range IoT |
| **LoRaWAN** | Long-range, low-power IoT protocol |
| **REST** | HTTP-based integration for cloud services |

### Key Concepts

| Concept | Description |
|---|---|
| **Hub** | A managed MQTT broker instance |
| **Device** | An IoT endpoint that connects to the hub |
| **Topic** | A named channel for publishing and subscribing to messages |
| **Route** | A rule that forwards messages to a Scaleway service (Object Storage, REST, Database) |
| **Device certificate** | TLS mutual authentication certificate for a device |
| **Network** | The protocol type used by devices (MQTT, Sigfox, LoRaWAN) |

### Quickstart

1. In the console, click **IoT Hub** in the **IoT** section.
2. Click **+ Create Hub**.
3. Choose a plan (**Shared** or **Dedicated**) and give the hub a name.
4. Add **devices** (and optionally set mutual TLS authentication).
5. Create **routes** to forward device data to Object Storage, external REST endpoints, or databases.
6. Connect your device using an MQTT client and your hub's endpoint.

### Security

- **Mutual TLS** is the default authentication method: each device has a unique X.509 certificate.
- Custom certificate authorities can be registered for enterprise PKI integration.
- Topics can have access control restrictions per device.

### Routes (Data Forwarding)

IoT Hub can automatically route device messages to:
- **Object Storage:** Store messages as files/objects.
- **REST endpoint:** Forward messages to any HTTP webhook.
- **Scaleway Database:** Persist messages to a managed database.

## 37. Web Hosting

**URL:** https://www.scaleway.com/en/docs/webhosting/

### Overview

Scaleway **Web Hosting** is a fully managed, shared hosting service powered by **cPanel**. It is designed for personal websites, blogs, small businesses, and e-commerce stores. It includes one-click app installation, email hosting, SSL certificates, and more.

### Key Features

- **420+ one-click installable apps** (WordPress, Drupal, Joomla, etc.) via Softaculous.
- **cPanel** control panel for managing files, databases, email, and more.
- **Free SSL/TLS** certificates (Let's Encrypt).
- **PHP** support with multiple PHP versions.
- **MySQL/MariaDB** databases.
- **Email hosting** with webmail (Roundcube).
- **FTP/SFTP** access.
- **phpMyAdmin** for database management.

### Key Concepts

| Concept | Description |
|---|---|
| **Hosting plan** | A subscription with specific resource limits (storage, bandwidth, domains) |
| **cPanel** | The web control panel for managing the hosting account |
| **Domain** | The domain name associated with the hosting plan |
| **Addon domain** | Additional domains hosted on the same plan |
| **Subdomain** | A subdomain of the main hosting domain |
| **Email account** | A mailbox associated with the hosting domain |
| **FTP account** | File transfer credentials for uploading website files |
| **MySQL database** | A relational database for applications like WordPress |
| **SSL certificate** | Enables HTTPS for the hosted website |

### Quickstart

1. In the console, click **Web Hosting** in the **Domains & Web Hosting** section.
2. Click **+ Create Web Hosting**.
3. Enter a **domain name** and select a **plan**.
4. Click **Create**.
5. Access **cPanel** from the console.
6. Install WordPress (or another app) via **Softaculous** in cPanel.
7. Point your domain's nameservers or A record to the hosting server IP.

### PHP Versions

Scaleway Web Hosting supports multiple PHP versions, selectable per domain through cPanel's MultiPHP Manager.

## 38. Web Hosting Classic (cPanel)

**URL:** https://www.scaleway.com/en/docs/classic-hosting/

### Overview

**Web Hosting Classic** (also referred to as **cPanel Hosting** in older documentation) is Scaleway's historical web hosting service originating from Online.net. It is a legacy offering; new customers are directed to the current **Web Hosting** product (see Section 37). Existing Classic customers can migrate to the new cPanel-based Web Hosting.

### Key Features

- Classic shared hosting plans.
- Email hosting with webmail.
- FTP access for file management.
- MySQL databases.
- PHP support.
- HTTPS support via Let's Encrypt.

### Migration

Scaleway provides migration tooling and documentation to help Classic Hosting customers move to the new Web Hosting (cPanel) platform:

- Technical migration information is available at: https://www.scaleway.com/en/docs/webhosting/reference-content/classic-hosting-migration-information/
- The migration preserves domains, email accounts, and databases.

### How-Tos

- **Enable HTTPS:** Navigate to the domain settings in the Classic console and activate Let's Encrypt.
- **Manage DNS servers:** Update nameservers from the Dedibox console's Domain section.
- **Access webmail:** Navigate to `https://webmail.<your-domain>` or through the console.

## Appendix: Scaleway Service Directory

### Quick Reference — All Services

| Service | Category | URL |
|---|---|---|
| Instances (CPU/GPU) | Compute | `/docs/instances/` |
| GPU Instances | Compute | `/docs/gpu/` |
| Apple Silicon | Compute | `/docs/apple-silicon/` |
| Elastic Metal | Bare Metal | `/docs/elastic-metal/` |
| Dedibox | Bare Metal | `/docs/dedibox/` |
| Kubernetes (Kapsule/Kosmos) | Compute | `/docs/kubernetes/` |
| Serverless Functions | Serverless | `/docs/serverless-functions/` |
| Serverless Containers | Serverless | `/docs/serverless-containers/` |
| Serverless Jobs | Serverless | `/docs/serverless-jobs/` |
| Serverless SQL Databases | Serverless | `/docs/serverless-sql-databases/` |
| Object Storage | Storage | `/docs/object-storage/` |
| Block Storage | Storage | `/docs/block-storage/` |
| File Storage | Storage | `/docs/file-storage/` |
| Managed DB PostgreSQL/MySQL | Databases | `/docs/managed-databases-for-postgresql-and-mysql/` |
| Managed DB Redis™ | Databases | `/docs/managed-databases-for-redis/` |
| Managed MongoDB® | Databases | `/docs/managed-mongodb-databases/` |
| OpenSearch | Databases | `/docs/opensearch/` |
| VPC & Private Networks | Networking | `/docs/vpc/` |
| Public Gateways | Networking | `/docs/public-gateways/` |
| Load Balancers | Networking | `/docs/load-balancer/` |
| Edge Services | Networking | `/docs/edge-services/` |
| Domains and DNS | Networking | `/docs/domains-and-dns/` |
| IPAM | Networking | `/docs/ipam/` |
| Generative APIs | AI | `/docs/generative-apis/` |
| Managed Inference | AI | `/docs/managed-inference/` |
| Queues (SQS) | Messaging | `/docs/queues/` |
| NATS | Messaging | `/docs/nats/` |
| Transactional Email | Messaging | `/docs/transactional-email/` |
| Cockpit | Observability | `/docs/cockpit/` |
| Secret Manager | Security | `/docs/secret-manager/` |
| Key Manager | Security | `/docs/key-manager/` |
| Audit Trail | Security | `/docs/audit-trail/` |
| Container Registry | Developer Tools | `/docs/container-registry/` |
| IoT Hub | IoT | `/docs/iot-hub/` |
| Web Hosting (cPanel) | Hosting | `/docs/webhosting/` |
| Web Hosting Classic | Hosting (Legacy) | `/docs/classic-hosting/` |
| IAM | Account/Security | `/docs/iam/` |
| Account & Organizations | Account | `/docs/account/` |

### API & Developer Resources

| Resource | URL |
|---|---|
| Scaleway API Reference | https://www.scaleway.com/en/developers/api/ |
| Scaleway CLI | https://github.com/scaleway/scaleway-cli |
| Terraform Provider | https://registry.terraform.io/providers/scaleway/scaleway |
| Pulumi Provider | https://www.pulumi.com/registry/packages/scaleway/ |
| Go SDK | https://github.com/scaleway/scaleway-sdk-go |
| Python SDK | https://github.com/scaleway/scaleway-sdk-python |
| JavaScript SDK | https://github.com/scaleway/scaleway-sdk-js |
| Scaleway Console | https://console.scaleway.com |
| Status Page | https://status.scaleway.com |
| Changelog | https://www.scaleway.com/en/docs/changelog/ |
