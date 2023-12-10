import './../css/index.css';
import GitHubSDK from './GitHubSDK';
import catImage from './../img/Cat.png';


document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('search-form');
    const inputName = document.getElementById('inputName');
    const inputToken = document.getElementById('inputToken');
    const userInfoSection = document.getElementById('user-info');
    const projectList = document.getElementById('project-list');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = inputName.value;
        const token = inputToken.value;

        const sdk = new GitHubSDK(name, token);

        try {
            const authenticated = await sdk.authenticate();
            if (authenticated) {
                await displayUserInfo(sdk, name);
                const repos = await sdk.getUserRepos();
                displayUserRepos(repos);
            } else {
                alert('Authentication failed');
            }
        } catch (error) {
            console.error(error);
            alert('Error: ' + error.message);
        }
    });

    const userAvatar = document.getElementById('user-avatar');
    userAvatar.src = catImage;
    userAvatar.alt = 'Default Cat Avatar';

    async function displayUserInfo(sdk, name) {
        try {
            const avatarUrl = await sdk.getUserAvatar();
            const login = await sdk.getUserLogin();
    
            userInfoSection.innerHTML = `
                <img src="${avatarUrl}" alt="Avatar of ${name}" id="user-avatar">
                <p id="user-name">${name}</p>
                <p id="user-login">Login: ${login}</p>
            `;
        } catch (error) {
            console.error('Error displaying user info:', error);
            userInfoSection.innerHTML = `<p>Error loading user information.</p>`;
        }
    }

    function displayUserRepos(repos) {
        const list = document.getElementById('project-list');
        const template = document.getElementById('repo-template').content;
        list.innerHTML = ''; 
    
        repos.forEach(repo => {
            const clone = document.importNode(template, true);
            clone.querySelector('.project-name').textContent = repo.name;
            clone.querySelector('.project-description').textContent = repo.description || 'No description';
            clone.querySelector('.button-go-to-repo').href = repo.html_url;
            list.appendChild(clone);
        });
    }
});