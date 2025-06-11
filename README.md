# Travel-map-client

https://yaytsa.com/

## Initialize

```
yarn install
```

Put the server URL in `.env.local` or as an env variable:

```
VITE_ALLOWED_HOST=localhost
VITE_SERVER_URL=http://localhost:8080/
```

## Usage

### Development

Run the app in the development mode:

```bash
yarn start
```

Open http://localhost:5173 to view it in the browser.

### Production

Create an optimized production build and serve it with a static server:

## Serving in production:

```bash
yarn build
yarn global add serve
serve -s dist -l tcp://127.0.0.1:9173
```
