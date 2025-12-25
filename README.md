# Health Hack

## AWS Work Flow

0. One-time setup (each teammate)

pnpm install
brew install aws-sam-cli

1. Create a new handler file

Add a file in:
services/workers/src/handlers/<newHandler>.js

Ex:
```
import "dotenv/config";

export async function handler(event) {
  console.log("placeCall invoked");
  console.log(JSON.stringify(event, null, 2));
}
```

2. Wire it into SAM (this is what deploys it)

Edit:
infra/sam/template.yaml

ex
```
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
```
Handler must match your file + export
If you want a separate queue per event, add another AWS::SQS::Queue resource and point the Event to that queue instead.

3) Add a local test event file (for sam local invoke)

Create:
infra/sam/events/<newHandler>.json
Example: infra/sam/events/placeCall.json

```
{
  "Records": [
    {
      "body": "{\"type\":\"PlaceCall\",\"outreachId\":\"demo-outreach-123\"}"
    }
  ]
}
```

4.
```
Local test (fast feedback)

From repo root:

cd infra/sam
sam build
sam local invoke PlaceCallFunction -e events/placeCall.json
```



PR checklist (so merges don’t suck):

- [] New handler file added under services/workers/src/handlers/

- [] infra/sam/template.yaml updated with new function + event mapping

- [] Added infra/sam/events/<name>.json for local invoke

- [] sam build passes

- []Deployed to dev stack and validated logs
