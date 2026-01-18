import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "healthhack-backend",

  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "us-east-1",
    stage: "${opt:stage, 'dev'}",
    httpApi: { cors: true },

    vpc: {
      securityGroupIds: ["sg-0be76907e96d27806"],
      subnetIds: ["subnet-0896145c233b9e36c", "subnet-03e9417cdc3c41585"],
    },

    environment: {
      DB_HOST: "${ssm:/healthhack/${self:provider.stage}/DB_HOST}",
      DB_PORT: "${ssm:/healthhack/${self:provider.stage}/DB_PORT}",
      DB_NAME: "${ssm:/healthhack/${self:provider.stage}/DB_NAME}",
      DB_USER: "${ssm:/healthhack/${self:provider.stage}/DB_USER}",
      DB_PASSWORD: "${ssm:/healthhack/${self:provider.stage}/DB_PASSWORD}",
      DB_SSL: "${ssm:/healthhack/${self:provider.stage}/DB_SSL}",
      JWT_SECRET: "${ssm:/healthhack/JWT_SECRET}",

      // ✅ use the queue created by this stack (matches IAM below)
      QUEUE_URL: { Ref: "JobsQueue" },

      TWILIO_ACCOUNT_SID: "${ssm:/healthhack/${self:provider.stage}/TWILIO_ACCOUNT_SID}",
      TWILIO_AUTH_TOKEN: "${ssm:/healthhack/${self:provider.stage}/TWILIO_AUTH_TOKEN}",
      TWILIO_NUMBER: "${ssm:/healthhack/${self:provider.stage}/TWILIO_NUMBER}",

      GOOGLE_MAPS_API_KEY: "${ssm:/healthhack/${self:provider.stage}/GOOGLE_MAPS_API_KEY}",
      GEOCODE_KEY: "${ssm:/healthhack/${self:provider.stage}/GEOCODE_KEY}"
    },

    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "ec2:CreateNetworkInterface",
              "ec2:DescribeNetworkInterfaces",
              "ec2:DeleteNetworkInterface",
              "ec2:DescribeSubnets",
              "ec2:DescribeSecurityGroups",
              "ec2:DescribeVpcs",
            ],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["ssm:GetParameter", "ssm:GetParameters", "ssm:GetParametersByPath"],
            Resource: "arn:aws:ssm:us-east-1:*:parameter/healthhack/*",
          },
          {
            Effect: "Allow",
            Action: ["kms:Decrypt"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: [
              "sqs:SendMessage",
              "sqs:ReceiveMessage",
              "sqs:DeleteMessage",
              "sqs:GetQueueAttributes",
              "sqs:ChangeMessageVisibility",
            ],
            Resource: { "Fn::GetAtt": ["JobsQueue", "Arn"] },
          },
        ],
      },
    },
  },

  build: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: "node20",
      platform: "node",
    },
  },

  functions: {
    authRegister: {
      handler: "src/functions/auth-register/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/auth/register" } }],
    },
    authLogin: {
      handler: "src/functions/auth-login/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/auth/login" } }],
    },
    authLogout: {
      handler: "src/functions/auth-logout/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/auth/logout" } }],
    },
    createDoctor: {
      handler: "src/functions/create-doctor/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/createDoctor" } }],
    },
    createPatients: {
      handler: "src/functions/create-patient/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/createPatients" } }],
    },
    makeCall: {
      handler: "src/functions/twilio-make-call/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/makeCall" } }],
    },
    findHospital:{
      handler: "src/functions/hospital/hospital-finder/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/findHospital" } }],
    },
    saveHospital:{
      handler: "src/functions/hospital/save-hospital/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/saveHospital" } }],
    },
    getHospital:{
      handler: "src/functions/hospital/get-hospitals/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/getHospital" } }],
    },
    getPatients:{
      handler: "src/functions/get-patients/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/getPatients" } }],
    },
    jobsWorker: {
      handler: "src/functions/jobs-worker/handler.handler",
      timeout: 30,
      events: [
        {
          sqs: {
            arn: { "Fn::GetAtt": ["JobsQueue", "Arn"] },
            batchSize: 10,
            maximumBatchingWindow: 5,
          },
        },
      ],
    },
  },

  resources: {
    Resources: {
      JobsDLQ: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "${self:service}-${self:provider.stage}-jobs-dlq",
        },
      },
      JobsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "${self:service}-${self:provider.stage}-jobs",
          VisibilityTimeout: 60,
          RedrivePolicy: {
            deadLetterTargetArn: { "Fn::GetAtt": ["JobsDLQ", "Arn"] },
            maxReceiveCount: 5,
          },
        },
      },
    },
    Outputs: {
      JobsQueueUrl: { Value: { Ref: "JobsQueue" } },
      JobsQueueArn: { Value: { "Fn::GetAtt": ["JobsQueue", "Arn"] } },
    },
  } as any,
};

module.exports = serverlessConfiguration;