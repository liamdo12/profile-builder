# Playwright official image includes Chromium and all OS dependencies.
# Using noble (Ubuntu 24.04) for up-to-date glibc compatibility.
FROM mcr.microsoft.com/playwright:v1.50.0-noble

WORKDIR /app

# Install dependencies first (layer cached unless package.json changes)
COPY package.json ./
RUN npm install --omit=dev

# Copy application source
COPY src/ ./src/

# Expose crawler service port
EXPOSE 3001

# Non-root user for security (playwright image provides pwuser)
USER pwuser

CMD ["node", "src/server.js"]
