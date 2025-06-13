const { execSync } = require('child_process');

try {
  const output = execSync('sui client publish --gas-budget 5000', { encoding: 'utf8' });
  const pkg = /Published package:\s*(\S+)/.exec(output);
  if (pkg) {
    console.log('Package ID:', pkg[1]);
  } else {
    console.log(output);
  }
} catch (e) {
  console.error('Failed to deploy:', e.message);
}
