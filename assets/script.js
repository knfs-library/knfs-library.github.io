document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');

  fetchRepoData('knfs-library');

  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm !== '') {
      fetchRepoData('knfs-library', searchTerm);
    } else {
      fetchRepoData('knfs-library');
    }
  });

  function fetchRepoData(username, searchTerm = '') {
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(response => response.json())
      .then(repos => {
        repoList.innerHTML = ''; // Clear previous results
        repos.forEach(repo => {
          // Check if repo matches search term
          if (repo.name.toLowerCase().includes(searchTerm)) {
            const repoItem = document.createElement('div');
            repoItem.classList.add('col-md-6', 'mb-4');

            repoItem.innerHTML = `
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title"><a href="${repo.html_url}" target="_blank">${repo.name}</a></h5>
                  <p class="card-text">${repo.description || 'No description'}</p>
                  <p class="card-text">Language: ${repo.language || 'Unknown'}</p>
                  <p class="card-text">Stars: ${repo.stargazers_count}</p>
                  <p class="card-text"><a href="${repo.html_url}" target="_blank">GitHub Repository</a></p>
                  ${repo.homepage ? `<p class="card-text"><a href="${repo.homepage}" target="_blank">Demo Link</a></p>` : ''}
                </div>
              </div>
            `;

            repoList.appendChild(repoItem);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching GitHub API:', error);
      });
  }
});
