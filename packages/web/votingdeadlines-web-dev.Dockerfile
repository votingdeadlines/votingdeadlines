FROM node:14-buster

# Install system deps
RUN apt-get update && apt-get install -y curl apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

# Install JS deps
WORKDIR /votingdeadlines/packages/web
COPY package.json .
RUN yarn

# Add remaining files
COPY rollup.config.js .
COPY tsconfig.json .
COPY src src
