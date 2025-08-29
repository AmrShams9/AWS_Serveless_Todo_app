## Serverless TODO App 🚀

Build and deploy a full‑stack TODO application powered by AWS Lambda, API Gateway, DynamoDB, S3, and Auth0. Create, list, update, delete, and attach images to TODOs with a modern React frontend.

### Highlights
- **Serverless backend**: API Gateway + Lambda (Node 20), DynamoDB, S3
- **Auth**: Custom API Gateway Lambda Authorizer validating Auth0 JWTs
- **Frontend**: React + Auth0 SDK + Axios
- **Attachments**: S3 pre‑signed uploads with image preview

---

## Architecture
- API Gateway exposes REST endpoints → Lambda handlers in `starter/backend/src/lambda/http` → business logic → DynamoDB (`Todos-<stage>`).
- S3 bucket stores attachments. Upload is done directly from the client via a pre‑signed URL returned by the API.
- Auth0 issues JWTs; the custom authorizer (`starter/backend/src/lambda/auth/index.mjs`) verifies RS256 tokens via JWKS.

<img alt="App" src="starter/client/public/logo512.png" width="120" />

---

## Quick Start
1) Backend
```bash
cd starter/backend
npm install
npx serverless deploy -v
```

2) Frontend
```bash
cd starter/client
npm install
npm start
```

3) Configure environment
- Backend `serverless.yml` (already set up in this repo):
  - `TODOS_TABLE`, `TODOS_S3_BUCKET`, `AUTH0_DOMAIN`
- Frontend `.env` (example):
```bash
REACT_APP_API_ENDPOINT=https://<apiId>.execute-api.us-east-1.amazonaws.com/dev
REACT_APP_AUTH0_DOMAIN=<your-auth0-domain>
REACT_APP_AUTH0_CLIENT_ID=<your-auth0-client-id>
REACT_APP_AUTH0_AUDIENCE=https://<your-api-identifier>
```

---

## API Reference

### Auth
- **Type**: Bearer JWT (Auth0) in `Authorization: Bearer <token>`
- **Authorizer**: Lambda authorizer verifies RS256 and issuer

### List TODOs
- **Method**: GET
- **Path**: `/todos`
- **Auth**: Required
- **Response**:
```json
{
  "items": [
    { "todoId": "uuid", "name": "string", "dueDate": "YYYY-MM-DD", "done": false, "attachmentUrl": "https://..." }
  ]
}
```

### Create TODO
- **Method**: POST
- **Path**: `/todos`
- **Auth**: Required
- **Request**:
```json
{ "name": "Buy bread", "dueDate": "2025-12-12" }
```
- **Response**:
```json
{ "item": { "todoId": "uuid", "name": "Buy bread", "dueDate": "2025-12-12", "done": false } }
```

### Update TODO
- **Method**: PATCH
- **Path**: `/todos/{todoId}`
- **Auth**: Required
- **Request**:
```json
{ "name": "Buy milk", "dueDate": "2025-12-20", "done": true }
```
- **Response**:
```json
{ "message": "Todo updated successfully" }
```

### Delete TODO
- **Method**: DELETE
- **Path**: `/todos/{todoId}`
- **Auth**: Required
- **Response**: `204 No Content`

### Generate Upload URL
- **Method**: POST
- **Path**: `/todos/{todoId}/attachment`
- **Auth**: Required
- **Response**:
```json
{ "uploadUrl": "https://<bucket>.s3.amazonaws.com/<todoId>?X-Amz-Algorithm=..." }
```

---

## cURL Examples
Replace `{API-ID}` and `{JWT}`.

```bash
# List
curl -H "Authorization: Bearer {JWT}" \
  https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos

# Create
curl -X POST -H "Authorization: Bearer {JWT}" -H "Content-Type: application/json" \
  -d '{"name":"Buy bread","dueDate":"2025-12-12"}' \
  https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos

# Update
curl -X PATCH -H "Authorization: Bearer {JWT}" -H "Content-Type: application/json" \
  -d '{"name":"Buy milk","dueDate":"2025-12-20","done":true}' \
  https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos/{TODO-ID}

# Delete
curl -X DELETE -H "Authorization: Bearer {JWT}" \
  https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos/{TODO-ID}

# Get upload URL
curl -X POST -H "Authorization: Bearer {JWT}" \
  https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos/{TODO-ID}/attachment
```

---

## Troubleshooting
- **CORS error on failures**: API Gateway error paths may omit CORS. This repo adds GatewayResponses for 4XX/5XX with `Access-Control-Allow-Origin` and credentials.
- **401/403 from authorizer**: Ensure `AUTH0_DOMAIN` is set on backend and the token issuer matches. Use a custom API audience (not `…/api/v2/`).
- **500 on DELETE**: Check CloudWatch logs for `DeleteTodo` and authorizer output.

---

## Screenshots
<img alt="App Logo" src="starter/client/public/logo192.png" width="72" />

---

## License
MIT
