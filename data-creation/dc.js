#!/usr/bin/env node

import program from 'commander';
import { seedDev, seedItems }from './seed';
import config from '../config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGOLAB_URI || config.developmentDB);

program
  .command('seed-dev')
  .action(seedDev);

program
  .command('seed-items')
  .action(seedItems);

program.parse(process.argv);
