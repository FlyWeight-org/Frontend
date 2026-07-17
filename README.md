# FlyWeight: Passenger weights, in the cloud

[![CI](https://github.com/FlyWeight-org/Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/FlyWeight-org/Frontend/actions/workflows/ci.yml)
[![Deploy](https://github.com/FlyWeight-org/Frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/FlyWeight-org/Frontend/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

FlyWeight is a website where pilots can list flights they intend to take, and
where passengers can discreetly add their weights to those flights. Weights are
only shared with the pilot, not with other passengers, and are no longer
accessible some time after the flight is complete.

This website allows pilots to perform an accurate weight and balance while
giving passengers a basic assurance of privacy.

## Development

### Installation and Running

FlyWeight requires Node 26 and pnpm. Run `pnpm install` to install all\
dependencies. Bundling is handled by Vite. Run `pnpm dev` to run a development
server.

The website requires the back-end to be running as well. See
<https://github.com/FlyWeight-org/Backend> for an example `Procfile`.

#### Testing

End-to-end testing is available with Playwright. The suite needs the back-end
stack running, so create a `Procfile.e2e` in the parent directory similar to:

```procfile
backend: cd Backend && PORT=5000 ANYCABLE_HTTP_RPC=true rvm 4.0.6@flyweight do rails server -e cypress -b 127.0.0.1
ws: cd Backend && rvm 4.0.6@flyweight do bin/anycable-go --port=8080 --rpc_host=http://127.0.0.1:5000/_anycable
e2e: cd Frontend && until curl -sfo /dev/null http://127.0.0.1:5000/up; do sleep 1; done && pnpm test:e2e
```

Rails runs in the `cypress` environment, which is what exposes the
`__cypress__/reset` and `__cypress__/last_email` helpers the fixtures drive.
Playwright's own `webServer` builds and previews the SPA on port 4173, so no
front-end process belongs here.

Install `overmind` and run the suite with `overmind start -f Procfile.e2e`. To
work through the tests interactively instead, use `pnpm test:e2e:dev` against a
stack started the same way.

#### Deployment

The application is deployed on Fly.io automatically after CI completes, with a
GitHub Action. The `fly.toml` file contains the architecture for the production
environment: an app server, a GoodJob worker server, a Redis cluster, and a
PostgreSQL database cluster.

The Rails processes run on a separate Fly.io cluster from the AnyCable
processes. An nginx cluster reverse-proxies requests for `/cable` to the
AnyCable process, and all other requests to the Rails process.

## Architecture

FlyWeight is a Ruby on Rails application with an independent Vue 3 front-end.

Only basic assurances of privacy are provided. Flights are only ever referenced
by a generated UUID, to prevent URL-crafting attacks. Pilots can only access
flights whose planned dates are at most one week old.

### Authorization

Some routes will operate differently depending on whether a pilot is logged in
or not. For example the `/flights/:id` route will display a summary of the
passengers and their weights for authenticated sessions, but will display only a
create-passenger form for unauthenticated sessions. Therefore, the URL that the
pilot uses to view their flight, and the URL they provide to their passengers,
are the same.
