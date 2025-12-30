# Health Hack – AWS Workflow (Workers + SAM)

## 0. One-time setup (each teammate)

Install dependencies and AWS SAM:

    pnpm install
    brew install aws-sam-cli

---

## 1. Create a new handler file

Add a new handler under:

    services/workers/src/handlers/<newHandler>.js

Example (`placeCall.js`):

    import "dotenv/config";

    export async function handler(event) {
      console.log("placeCall invoked");
      console.log(JSON.stringify(event, null, 2));
    }

The exported function **must** be named `handler`.

---

## 2. Wire the handler into SAM

Edit:

    infra/sam/template.yaml

Example:

    PlaceCallFunction:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: ../../services/workers
        Handler: src/handlers/placeCall.handler
        Events:
          OutreachQueueEvent:
            Type: SQS
            Properties:
              Queue: !GetAtt OutreachQueue.Arn
              BatchSize: 1
        Policies:
          - AWSLambdaBasicExecutionRole

Notes:
- `Handler` must match: `src/handlers/<fileName>.handler`
- To use a separate queue per handler, add another `AWS::SQS::Queue`
  resource and reference it in the event mapping.

---

## 3. Add a local test event

Create:

    infra/sam/events/<newHandler>.json

Example (`infra/sam/events/placeCall.json`):

    {
      "Records": [
        {
          "body": "{\"type\":\"PlaceCall\",\"outreachId\":\"demo-outreach-123\"}"
        }
      ]
    }

This mirrors the SQS event shape Lambda receives.

---

## 4. Local testing (fast feedback)

From the repo root:

    cd infra/sam
    sam build
    sam local invoke PlaceCallFunction -e events/placeCall.json

---

## PR Checklist

- [ ] New handler added under `services/workers/src/handlers/`
- [ ] `infra/sam/template.yaml` updated with function + SQS event mapping
- [ ] Local event added under `infra/sam/events/`
- [ ] `sam build` passes locally
- [ ] Deployed to dev stack and logs validated
