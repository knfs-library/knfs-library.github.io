const hiddenArr = ['knfs-library.github.io'];

document.addEventListener('DOMContentLoaded', () => {
  const lazyBackgrounds = document.querySelectorAll('#slider[data-bg]');
  const spinner = document.getElementById('spinner');
  const repoList = document.getElementById('repo-list');
  const searchInput = document.getElementById('searchInput');

  // Lazy load background images
  if ('IntersectionObserver' in window) {
    const lazyBackgroundObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyBackground = entry.target;
          lazyBackground.style.backgroundImage = `url(${lazyBackground.dataset.bg})`;
          lazyBackgroundObserver.unobserve(lazyBackground);
        }
      });
    });

    lazyBackgrounds.forEach(lazyBackground => {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  } else {
    // Fallback for browsers without IntersectionObserver support
    lazyBackgrounds.forEach(lazyBackground => {
      lazyBackground.style.backgroundImage = `url(${lazyBackground.dataset.bg})`;
    });
  }

  // Fetch initial repo data
  fetchRepoData('knfs-library');

  // Add debounce to search input
  let debounceTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      fetchRepoData('knfs-library', searchTerm);
    }, 300); // Adjust debounce delay as needed
  });

  // Fetch and render repo data
  function fetchRepoData(username, searchTerm = '') {
    spinner.style.display = 'block'; // Show spinner
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(repos => {
        repoList.innerHTML = '';
        repos
          .filter(repo => hiddenArr.indexOf(repo.name) === -1)
          .filter(repo => repo.name.toLowerCase().includes(searchTerm))
          .forEach(repo => {
            const repoItem = document.createElement('div');
            repoItem.classList.add('col-md-6', 'mb-4');

            repoItem.innerHTML = `
              <div class="card" style="height: 15em !important;">
                <div class="card-body">
                  <h5 class="card-title">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                  </h5>
                  <p class="card-text">${repo.description || 'No description'}</p>
                  <p class="card-text">Language: ${repo.language || 'Unknown'}</p>
                  <p class="card-text">Stars: ${repo.stargazers_count}</p>
                  <p class="card-text">
                    <a href="${repo.html_url}" target="_blank">GitHub Repository</a>
                  </p>
                  ${repo.homepage ? `<p class="card-text"><a href="${repo.homepage}" target="_blank">Demo Link</a></p>` : ''}
                </div>
              </div>
            `;

            repoList.appendChild(repoItem);
          });
      })
      .catch(error => {
        console.error('Error fetching GitHub API:', error);
      })
      .finally(() => {
        spinner.style.display = 'none';
      });
  }
});
