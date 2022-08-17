#!/usr/bin/env node
import 'source-map-support/register';

import { stages } from './config/stages'
import { SimpleStaticSite } from "./static-site";
import { QkkApp } from '@qkk/cdk-core';

const app = new QkkApp({
  appPrefix: 'SimpleStaticSite',
  stages: stages
});

app.run((envName, env) => {
  new SimpleStaticSite(app, `${envName}SimpleStaticSite`, {
    name: `${envName}SimpleStaticSite`,
    stage: envName,
    env
  });
});