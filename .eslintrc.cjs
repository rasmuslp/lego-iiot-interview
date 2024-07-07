/** @type {import("eslint").Linter.Config} */
const config = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
	},
	extends: [
		'@rasmuslp',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'prettier',
	],
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'@typescript-eslint/no-unused-vars': 'warn',
		'n/no-missing-import': 'off',
		'n/no-unsupported-features/node-builtins': [
			'error',
			{ ignores: ['fetch'] },
		],
		'no-console': 'off', // Keep for now
		'unicorn/prefer-node-protocol': 'error',
	},
	settings: {
		'import/resolver': {
			node: true,
			typescript: true,
		},
	},
};

module.exports = config;
