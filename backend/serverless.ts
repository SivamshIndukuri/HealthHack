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
      subnetIds: ["subnet-0896145c233b9e36c", "subnet-03e9417cdc3c41585"]
    },

    environment: {
      DB_HOST: "${ssm:/healthhack/${self:provider.stage}/DB_HOST}",
      DB_PORT: "${ssm:/healthhack/${self:provider.stage}/DB_PORT}",
      DB_NAME: "${ssm:/healthhack/${self:provider.stage}/DB_NAME}",
      DB_USER: "${ssm:/healthhack/${self:provider.stage}/DB_USER}",
      DB_PASSWORD: "${ssm:/healthhack/${self:provider.stage}/DB_PASSWORD}",
      DB_SSL: "${ssm:/healthhack/${self:provider.stage}/DB_SSL}",
      JWT_SECRET: "${ssm:/healthhack/JWT_SECRET}"
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
            Action: [
              "ssm:GetParameter",
              "ssm:GetParameters",
              "ssm:GetParametersByPath",
            ],
            Resource: "arn:aws:ssm:us-east-1:*:parameter/healthhack/*",
          },

          
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
    authLogin: {
      handler: "src/functions/auth-login/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/auth/login" } }],
    },
    authLogout: {
      handler: "src/functions/auth-logout/handler.handler",
      events: [{ httpApi: { method: "POST", path: "/auth/logout" } }],
    },
  },
};

module.exports = serverlessConfiguration;
