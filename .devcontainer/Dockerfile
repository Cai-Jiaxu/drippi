# .devcontainer/Dockerfile
FROM node:20

# Install basic dev tools + Python build deps + image libraries + MySQL client headers
RUN apt-get update && \
    apt-get install -y less man-db sudo \
                       build-essential libjpeg-dev zlib1g-dev default-libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists/*

# Ensure default `node` user has sudo privileges
ARG USERNAME=node
RUN echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

ENV DEVCONTAINER=true

