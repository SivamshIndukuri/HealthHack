import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "healthhack-backend",

  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "us-east-1",
    stage: "${opt:stage, 'dev'}",
    httpApi: { cors: true },

    // --- Put Lambda in the same VPC as your PRIVATE RDS ---
    vpc: {
      securityGroupIds: ["sg-02c9bdda77b5ba015"],
      subnetIds: ["subnet-0896145c233b9e36c", "subnet-03e9417cdc3c41585"]
    },

    // --- Load DB creds from SSM Parameter Store (no secrets in git) ---
    environment: {
      DB_HOST: "${ssm:/healthhack/${self:provider.stage}/DB_HOST}",
      DB_PORT: "${ssm:/healthhack/${self:provider.stage}/DB_PORT}",
      DB_NAME: "${ssm:/healthhack/${self:provider.stage}/DB_NAME}",
      DB_USER: "${ssm:/healthhack/${self:provider.stage}/DB_USER}",
      DB_PASSWORD: "${ssm:/healthhack/${self:provider.stage}/DB_PASSWORD}",
      DB_SSL: "${ssm:/healthhack/${self:provider.stage}/DB_SSL}",
    },

    // --- Permissions ---
    iam: {
      role: {
        statements: [
          // Required for Lambda-in-VPC (ENI creation)
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

          // Allow reading SSM parameters for /healthhack/*
          {
            Effect: "Allow",
            Action: [
              "ssm:GetParameter",
              "ssm:GetParameters",
              "ssm:GetParametersByPath",
            ],
            Resource: "arn:aws:ssm:us-east-1:*:parameter/healthhack/*",
          },

          // Needed to decrypt SecureString params (can tighten later)
          {
            Effect: "Allow",
            Action: ["kms:Decrypt"],
            Resource: "*",
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
  },
};

module.exports = serverlessConfiguration;
