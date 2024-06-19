# FlyWeight: Passenger weights, in the cloud

FlyWeight is a website where pilots can list flights they intend to take, and
where passengers can discreetly add their weights to those flights. Weights are
only shared with the pilot, not with other passengers, and are no longer
accessible some time after the flight is complete.

This website allows pilots to perform an accurate weight and balance while
giving passengers a basic assurance of privacy.

## Development

### Installation and Running

FlyWeight requires Node 16 and Yarn. Run `yarn install` to install all\
dependencies. Bundling is handled by Vite. Run `yarn dev` to run a development
server.

The website requires the back-end to be running as well. See
https://github.com/FlyWeight-org/Backend for an example `Procfile`.

#### Testing

End-to-end testing is available with Cypress. To run end-to-end tests, create a
`Procfile` similar to:

```
backend: cd Backend && rvm 3.2.2@flyweight exec rails server -e cypress -b 127.0.0.1
frontend: cd Frontend && yarn build && yarn run test:e2e
jobs: cd Backend && redis-cli flushall && rvm 3.2.2@flyweight exec bundle exec sidekiq -C config/sidekiq.yml -e cypress
cable: cd Backend && rvm 3.2.2@flyweight exec ./bin/cable -e cypress
```

Install the `foreman` gem to run the Procfile.

#### Deployment

This application is deployed using Fly.io. The `deploy.yml` GitHub Actions
workflow runs automatically after CI completes.

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
