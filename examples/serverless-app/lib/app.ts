#!/usr/bin/env node
import 'source-map-support/register';

import { stages } from './config/stages'
import { ServerlessApp } from './serverless-app';
import { QkkApp } from '@qkk/cdk-core';

const app = new QkkApp({
  appPrefix: 'SimpleServerlessApp',
  stages: stages
});

app.run((envName, env) => {
  new ServerlessApp(app, `${envName}SimpleServerlessApp`, {
    name: `${envName}SimpleServerlessApp`,
    stage: envName,
    env
  });
});