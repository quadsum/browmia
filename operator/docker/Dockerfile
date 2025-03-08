ARG BASE_IMAGE=ubuntu:22.04
FROM $BASE_IMAGE

ENV PLUGINS_PATH=/app

# install python deps

RUN apt-get update; apt-get install -y --no-install-recommends python3 python3-pip curl build-essential git; \
    # clean up
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh; \
    . $HOME/.local/bin/env; \
    uv version 
# install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash; \
    export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; \
    nvm version

COPY ./plugins/browser-use $PLUGINS_PATH/browser-use
COPY ./plugins/encrypt-storage $PLUGINS_PATH/encrypt-storage

# install browser-use deps
RUN cd $PLUGINS_PATH/browser-use; \
    . $HOME/.local/bin/env; \
    uv venv --python 3.11; \
    . .venv/bin/activate; \
    uv pip install -r pyproject.toml

# install encrypt-storage deps

RUN cd $PLUGINS_PATH/encrypt-storage; \
    export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; \
    nvm install 20; \
    npm i -g yarn; \
    yarn install; \
    yarn build


# add custom chrome policies
COPY ./policy_config.json /etc/opt/chrome/policies/managed/policy_config.json

# add custom plugins
COPY ./runit /etc/runit/runsvdir/default

