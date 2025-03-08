# Browmia Operator

## About

Main folder for running a Browmia Operator node.

## Quickstart (docker)

To get started, supply the required environment variables in an environment variables file (e.g. .env.chrome) for the integration, most notably:

`RUN_WITH_PROXY`: false or true, if you intend to run it with proxy support also set `PROXY_URL` with an  http or socks5 proxy url.
`ENCRYPT_STORAGE_OPERATOR_PK`: your stringified EVM private key
`ENCRYPT_STORAGE_NILLION_ORG_DID`: your nillion SecretLLM ord did string. Refer to [Register an Organization](https://docs.nillion.com/build/secretVault-secretDataAnalytics/access) to create your own org. 
`ENCRYPT_STORAGE_NILLION_ORG_SECRET_KEY`: your Nillion SecretLLM org secret key.
`ENCRYPT_STORAGE_VAULT_ID`: a bytes 32 stringified id for interacting with Browmia Vault contract. You can create yours with ```cast keecak "my_vault_id"```.
`BROWSER_USE_OPENAI_API_KEY`: your OpenAI api key. Refer to [OpenAI developer platform](https://platform.openai.com/) for set up.

Install docker and docker compose:

```bash
curl -fsSL https://get.docker.com  | sh
```

Once environment variables are set, run docker compose with the compose file.

```bash
docker compose --env-file .env.chrome -f docker-compose.yml up -d
```

You can check runtime logs with:

```bash
docker compose logs -f --tail 100
```