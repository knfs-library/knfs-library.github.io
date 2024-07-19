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
    lazyBackgrounds.forEach(lazyBackground => {
      lazyBackground.style.backgroundImage = `url(${lazyBackground.dataset.bg})`;
    });
  }

  // Fetch initial repo data
  fetchRepoData('knfs-library');
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
    fetch('data.json')
      .then(response => response.json())
      .then(repos => {
        repoList.innerHTML = '';
        repos
          .filter(repo => hiddenArr.indexOf(repo.name) === -1)
          .filter(repo => repo.name.toLowerCase().includes(searchTerm))
          .forEach(repo => {

            const repoItem = document.createElement('div');
            repoItem.classList.add('col-md-6', 'mb-4');
            const links = repo.links.map(link => {
              return ` <a href="${link.url}" target="_blank">${link.name}</a>`
            })
            repoItem.innerHTML = `
              <div class="card" style="height: 18em !important;">
                <div class="card-body">
                  <h3 class="card-title">
                    <a href="${repo.home_url}" target="_blank">${repo.name}</a>
                  </h3>
                  <h6 class="card-subtitle mb-2 text-muted">
                    ${repo.latest_version}
                  </h6>
                  <div class="card-description text-muted">
                    <p>${repo.description}</p>
                  </div>
                  <hr>
                  <p class="card-text">Language: ${repo.languages.toString()}</p>
                  <p class="card-text">
                    ${links}
                  </p>
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
