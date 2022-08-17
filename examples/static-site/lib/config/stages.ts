import { Stage } from '@qkk/cdk-core';

export const stages: Stage[] = [
  {
    name: 'dev',
    prod: false,
    environment: [
      {
        account: '',
        region: ''
      }
    ]
  }
]