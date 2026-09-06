FROM jenkins/jenkins:lts

USER root

# Install Docker CLI and buildx plugin
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates curl gnupg && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends docker-ce-cli docker-buildx-plugin && \
    rm -rf /var/lib/apt/lists/*

# Install kubectl
RUN curl -fsSL -LO "https://dl.k8s.io/release/v1.37.0/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    rm kubectl

# Add jenkins user to docker group
RUN groupadd -f docker && usermod -aG docker jenkins

# Configure Git safe.directory to avoid ownership errors
RUN git config --system --add safe.directory '*'

# Run as root so Jenkins has access to /var/run/docker.sock
USER root

EXPOSE 8080
EXPOSE 50000
