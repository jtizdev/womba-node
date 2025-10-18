#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const WombaClient = require('./lib/client');

const VERSION = '1.0.0';

// Configure commander
program
  .name('womba')
  .description('Womba CLI - AI-powered test generation')
  .version(VERSION);

// Generate command
program
  .command('generate')
  .description('Generate test cases for a Jira story')
  .requiredOption('-s, --story <key>', 'Jira story key (e.g., PLAT-12991)')
  .option('-u, --upload', 'Upload generated tests to Zephyr')
  .action(async (options) => {
    try {
      await handleGenerate(options.story, options.upload);
    } catch (error) {
      console.error(chalk.red(`❌ ${error.message}`));
      process.exit(1);
    }
  });

// Health command
program
  .command('health')
  .description('Check API health status')
  .action(async () => {
    try {
      await handleHealth();
    } catch (error) {
      console.error(chalk.red(`❌ ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Handle generate command
 */
async function handleGenerate(storyKey, upload) {
  const apiUrl = process.env.WOMBA_API_URL;
  const apiKey = process.env.WOMBA_API_KEY;

  if (!apiUrl) {
    console.error(chalk.red('❌ Error: WOMBA_API_URL environment variable not set'));
    console.log('\nSet it with: export WOMBA_API_URL=https://womba-api.up.railway.app');
    process.exit(1);
  }

  if (!apiKey) {
    console.error(chalk.red('❌ Error: WOMBA_API_KEY environment variable not set'));
    console.log('\nSet it with: export WOMBA_API_KEY=your-api-key');
    process.exit(1);
  }

  console.log(chalk.cyan(`🚀 Generating tests for ${storyKey}...\n`));

  const client = new WombaClient(apiUrl, apiKey);
  const result = await client.generateTests(storyKey, upload);

  // Print results
  console.log(chalk.green(`\n✅ Successfully generated ${result.test_cases.length} test cases!`));
  console.log(chalk.cyan(`📊 Quality Score: ${result.quality_score.toFixed(1)}/100`));
  console.log(chalk.cyan(`📁 Suggested Folder: ${result.suggested_folder}`));
  console.log(chalk.cyan(`⏱️  Execution Time: ${result.execution_time_seconds.toFixed(2)}s`));

  if (result.metadata) {
    if (result.metadata.ai_model) {
      console.log(chalk.cyan(`🤖 AI Model: ${result.metadata.ai_model}`));
    }
  }

  // Print test cases
  console.log('\n' + chalk.yellow('Generated Test Cases:'));
  console.log(chalk.yellow('='.repeat(80)));

  result.test_cases.forEach((testCase, index) => {
    console.log(`\n${chalk.cyan(`${index + 1}. ${testCase.title}`)}`);
    console.log(`   Priority: ${testCase.priority} | Type: ${testCase.test_type}`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Steps: ${testCase.steps.length}`);
  });

  // Print Zephyr IDs if uploaded
  if (upload && result.zephyr_ids && result.zephyr_ids.length > 0) {
    console.log('\n' + chalk.green('✅ Uploaded to Zephyr:'));
    result.zephyr_ids.forEach((id, index) => {
      console.log(`   ${index + 1}. ${id}`);
    });
  }

  console.log('\n' + chalk.green('🎉 Done!'));
}

/**
 * Handle health command
 */
async function handleHealth() {
  const apiUrl = process.env.WOMBA_API_URL;
  const apiKey = process.env.WOMBA_API_KEY || '';

  if (!apiUrl) {
    console.error(chalk.red('❌ Error: WOMBA_API_URL environment variable not set'));
    process.exit(1);
  }

  console.log(chalk.cyan('🔍 Checking API health...\n'));

  const client = new WombaClient(apiUrl, apiKey);
  const result = await client.healthCheck();

  console.log(chalk.green('✅ API is healthy!'));
  console.log(`Status: ${result.status}`);
  console.log(`Version: ${result.version}`);

  if (result.dependencies) {
    console.log('\nDependencies:');
    Object.entries(result.dependencies).forEach(([name, status]) => {
      if (status === 'connected') {
        console.log(chalk.green(`  ✅ ${name}: ${status}`));
      } else {
        console.log(chalk.yellow(`  ⚠️  ${name}: ${status}`));
      }
    });
  }
}

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

