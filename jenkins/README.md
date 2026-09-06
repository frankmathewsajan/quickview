# Jenkins Setup

This directory contains the Docker configuration for Jenkins.

## Quick Start Options

### Option 1: Using Docker Compose (from project root)
Spins up backend, frontend, and Jenkins together:
```powershell
docker compose up -d jenkins
```
Or all services:
```powershell
docker compose up -d
```

### Option 2: Standalone via Docker Compose
From inside this `jenkins/` folder:
```powershell
docker compose up -d
```

### Option 3: Direct Docker Run
```powershell
docker pull jenkins/jenkins:lts
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```

---

## Accessing Jenkins

1. Open your browser to [http://localhost:8080](http://localhost:8080).
2. Jenkins will prompt you for an **Administrator password**.
3. Retrieve the password by running:
   ```powershell
   docker exec -it jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword
   ```
   *(If you ran with root compose, container name may be `learningsomestuff-jenkins-1` or check with `docker ps`)*
4. Complete the setup wizard by installing the recommended plugins and creating your admin user.

---

## Running the Deployment Pipeline

The project includes a `Jenkinsfile` in the repository root.

To run it:
1. In Jenkins dashboard, click **New Item**.
2. Enter a name (e.g. `todo-deploy`) and select **Pipeline**, then click **OK**.
3. Scroll to the **Pipeline** section at the bottom.
4. Set **Definition** to **Pipeline script from SCM**.
5. Select **SCM** as **Git** and enter your repository URL:
   ```text
   https://github.com/frankmathewsajan/quickview.git
   ```
6. Set **Branch Specifier** to `*/main`.
7. Ensure **Script Path** is `Jenkinsfile`.
8. Click **Save**, then click **Build Now**.
