module.exports = {
	apps: [
		{
			name: 'neighborhood-connections-eligibility',
			script: 'yarn',
			args: 'start',
			interpreter: '/bin/bash',
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
}
