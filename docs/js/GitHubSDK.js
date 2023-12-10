export default class GitHubSDK {
    constructor(name, token) {
        if (!name) {
            throw new Error('Missing name');
        }
        if (!token) {
            throw new Error('Missing token');
        }
        this.name = name;
        this.token = token;
    }

    async authenticate() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.name}`, {
                headers: {
                    Authorization: `token ${this.token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Authentication failed with status ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error during authenticating:', error);
            return false;
        }
            
    }

    async getUserRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.name}/repos`, {
                headers: {
                    Authorization: `token ${this.token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return [];
                }
                if (response.status === 401) {
                    throw new Error('Unauthorized access');
                }
                throw new Error('failed to fetch user repositories');
            }

            const repos = await response.json();
            return repos;
        } catch (error) {
            console.error('Error fetching repositories:', error);
            if (error.message.match(/Network Error|Failed to fetch/)) {
                throw new Error('Network Error');
            }
            throw error;
        }
    }

    async getUserAvatar() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.name}`, {
                headers: {
                    Authorization: `token ${this.token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
    
            const data = await response.json();
            return data.avatar_url;
        } catch (error) {
            console.error('Error fetching user avatar:', error);
            throw error;
        }
    }

    async getUserLogin() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.name}`, {
                headers: {
                    Authorization: `token ${this.token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
    
            const data = await response.json();
            return data.login;
        } catch (error) {
            console.error('Error fetching user login:', error);
            throw error;
        }
    }
}

