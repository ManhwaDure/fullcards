# fullcards

**fullcards** is an web application for creating single-page, consisted of fullsize card contents.
This application is written with [Next.js](https://nextjs.org) and TypeScript. This application needs MySQL-compatible database such as MariaDB.

## Requirements

- Node.js >=16.13.0
- MySQL-compatible relational database

## How to build and install

```bash
yarn
yarn build
# Create required configuration files here
yarn migrate-and-run
```

## Data and configuration files

Uploaded image files are located in `data/images` directory. Renaming files without database operation would be result in an error.

Several configuration files are located in `configs` directory. All config files are required.

- `jwks.json` : Asynmentric [JSON Web Key](https://datatracker.ietf.org/doc/html/rfc7517) set file. Automatically created if not found.
- `oidcConfig.json` : Authorization configuration for [OpenID Connect 1.0](https://openid.net/specs/openid-connect-core-1_0.html). Note that issuer **MUST** support [Section 4 of OpenID Connect Discovery 1.0 incorporating errata set 1](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig)
  - required properties
    - `issuerUrl`: string type, url to issuer
    - `client_id`, `client_secret`, `redirect_uri`: Client configuration. all of them is string type.
  - optional properties
    - `scopes`: array of string type, scopes which would be automatically added on request. Note that `openid profile` scope is automatically requested.
    - `additionalCheckFunction`: string type, function string that gets `userinfo` variable and returns boolean value whether authenticate him/her or not. For example, `return userinfo.sub === 'admin';`. With this example, Authentication would be failed if oidc userinfo sub property is not `admin`.
- `ormConfig.json` : Information used for connecting to database and initializing ORM. See [TypeORM DataSourceOptions reference](https://typeorm.io/data-source-options) for more details
