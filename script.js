    let currentPage = 'home';

    document.addEventListener('DOMContentLoaded', () => {
        initNav();
        initSearch();
        initBackToTop();
        renderPage('home');
    });

    function initNav() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                renderPage(page);
            });
        });
    }

    function initSearch() {
        const input = document.getElementById('search-input');
        const results = document.getElementById('search-results');
        let timeout;

        input.addEventListener('input', (e) => {
            clearTimeout(timeout);
            const query = e.target.value.trim().toLowerCase();

            if (query.length < 2) {
                results.classList.remove('active');
                return;
            }

            timeout = setTimeout(() => {
                const games = WIKI_DATA.games.filter(g =>
                    g.title.toLowerCase().includes(query) ||
                    g.description.toLowerCase().includes(query) ||
                    g.protagonist.toLowerCase().includes(query)
                );

                const characters = WIKI_DATA.characters.filter(c =>
                    c.name.toLowerCase().includes(query) ||
                    c.description.toLowerCase().includes(query)
                );

                if (games.length === 0 && characters.length === 0) {
                    results.innerHTML = '<div class="search-result-item">No results found</div>';
                    results.classList.add('active');
                    return;
                }

                let html = '';
                if (games.length > 0) {
                    html += '<div style="padding: 0.5rem 1rem; background: var(--color-bg); font-weight: bold; border-bottom: 1px solid var(--color-border);">Games (' + games.length + ')</div>';
games.slice(0, 5).forEach(game => {
html += `
<div class="search-result-item" onclick="showGameDetail('${game.id}')">
<strong>${game.title}</strong>
<span style="color: var(--color-primary);">(${game.year})</span><br>
<small style="color: var(--color-text-dim);">${game.setting}</small>
</div>`;
});
}if (characters.length > 0) {
                    html += '<div style="padding: 0.5rem 1rem; background: var(--color-bg); font-weight: bold; border-bottom: 1px solid var(--color-border);">Characters (' + characters.length + ')</div>';
                    characters.slice(0, 5).forEach(char => {
                        html += `
                            <div class="search-result-item" onclick="showCharacterDetail('${char.id}')">
                                <strong>${char.name}</strong><br>
                                <small style="color: var(--color-accent);">${char.role}</small>
                            </div>
                        `;
                    });
                }

                results.innerHTML = html;
                results.classList.add('active');
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !results.contains(e.target)) {
                results.classList.remove('active');
            }
        });
    }

    // Back to Top
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.pageYOffset > 300);
        });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Render Pages
    function renderPage(page) {
        currentPage = page;
        const content = document.getElementById('main-content');
        
        switch (page) {
            case 'home':
                renderHome(content);
                break;
            case 'games':
                renderGames(content);
                break;
            case 'characters':
                renderCharacters(content);
                break;
            case 'timeline':
                renderTimeline(content);
                break;
            case 'gameplay':
                renderGameplay(content);
                break;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Home Page
    function renderHome(container) {
        container.innerHTML = `
            <div class="section">
                <h2 class="section-title">Welcome to the Assassin's Creed Wiki</h2>
                <p><strong>Assassin's Creed</strong> is a historical action-adventure video game franchise created by Patrice Désilets and developed by Ubisoft. The series debuted in 2007 and has become one of the best-selling franchises of all time, with over <strong>200 million copies sold worldwide</strong>.</p>
                
                <p>The franchise is known for its unique blend of historical fiction, science fiction, and stealth-based gameplay. Players experience genetic memories of historical assassins through a device called the <strong>Animus</strong>, exploring richly detailed recreations of historical periods while uncovering a millennia-old conflict between two secret societies:</p>
                
                <ul>
                    <li><strong>The Assassin Brotherhood</strong> - fights to preserve free will and individual liberty</li>
                    <li><strong>The Templar Order</strong> - seeks to establish peace through order and control</li>
                </ul>

                <p>Both factions fight over powerful artifacts called <strong>Pieces of Eden</strong>, remnants of the ancient Isu civilization.</p>
            </div>

            <div class="section">
                <h3 class="section-subtitle">Featured Games</h3>
                <div class="cards-grid">
                    ${WIKI_DATA.games.slice(0, 6).map(game => `
                        <div class="card" onclick="showGameDetail('${game.id}')">
                            <div class="card-image">
                                <img src="${game.image}" alt="${game.title} Cover" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">

                                ${game.icon}</div>
                            <div class="card-content">
                                <span class="card-badge">${game.year}</span>
                                <h3 class="card-title">${game.title}</h3>
                                <p class="card-description">${game.description.substring(0, 120)}...</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <h3 class="section-subtitle">The Creed</h3>
                <blockquote style="border-left: 4px solid var(--color-primary); padding-left: 1.5rem; font-style: italic; font-size: 1.2rem; color: var(--color-primary);">
                    "Nothing is true, everything is permitted."
                </blockquote>
                <p>This maxim encapsulates the Assassin philosophy - rejecting absolute truth and emphasizing individual freedom and responsibility.</p>
            </div>
        `;
    }

    // Games Page
    function renderGames(container) {
        container.innerHTML = `
            <div class="section">
                <h2 class="section-title">All Games</h2>
                
                <div class="filter-bar">
                    <div class="filter-group">
                        <span class="filter-label">Sort:</span>
                        <select class="filter-select" id="game-sort">
                            <option value="year-desc">Newest First</option>
                            <option value="year-asc">Oldest First</option>
                            <option value="title">Title (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div id="games-container" class="cards-grid">
                    ${renderGameCards(WIKI_DATA.games)}
                </div>
            </div>
        `;

        document.getElementById('game-sort').addEventListener('change', (e) => {
            let sorted = [...WIKI_DATA.games];
            if (e.target.value === 'year-asc') sorted.sort((a, b) => a.year - b.year);
            else if (e.target.value === 'year-desc') sorted.sort((a, b) => b.year - a.year);
            else sorted.sort((a, b) => a.title.localeCompare(b.title));
            document.getElementById('games-container').innerHTML = renderGameCards(sorted);
        });
    }

    function renderGameCards(games) {
        return games.map(game => `
            <div class="card" onclick="showGameDetail('${game.id}')">
                <div class="card-image">
                    <img src="${game.image}" alt="${game.title} Cover" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
                    </div>
                <div class="card-content">
                    <span class="card-badge">${game.year}</span>
                    <h3 class="card-title">${game.title}</h3>
                    <p class="card-description">${game.description}</p>
                </div>
            </div>
        `).join('');
    }

    function showGameDetail(gameId) {
        const game = WIKI_DATA.games.find(g => g.id === gameId);
        if (!game) return;

        document.getElementById('search-results').classList.remove('active');
        document.getElementById('search-input').value = '';

        const container = document.getElementById('main-content');
        container.innerHTML = `
            <div class="section">
                <div class="infobox">
                    <div class="infobox-header">${game.title}</div>
                    <div class="infobox-image"><img src="${game.image}" alt="${game.title} Cover" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">

                    </div>
                    <div class="infobox-content">
                        <div class="infobox-row">
                            <div class="infobox-label">Release:</div>
                            <div class="infobox-value">${game.year}</div>
                        </div>
                        <div class="infobox-row">
                            <div class="infobox-label">Developer:</div>
                            <div class="infobox-value">${game.developer}</div>
                        </div>
                        <div class="infobox-row">
                            <div class="infobox-label">Publisher:</div>
                            <div class="infobox-value">${game.publisher}</div>
                        </div>
                        ${game.director ? `<div class="infobox-row">
                            <div class="infobox-label">Director:</div>
                            <div class="infobox-value">${game.director}</div>
                        </div>` : ''}
                        ${game.producer ? `<div class="infobox-row">
                            <div class="infobox-label">Producer:</div>
                            <div class="infobox-value">${game.producer}</div>
                        </div>` : ''}
                        ${game.composer ? `<div class="infobox-row">
                            <div class="infobox-label">Composer:</div>
                            <div class="infobox-value">${game.composer}</div>
                        </div>` : ''}
                        <div class="infobox-row">
                            <div class="infobox-label">Protagonist:</div>
                            <div class="infobox-value">${game.protagonist}</div>
                        </div>
                        <div class="infobox-row">
                            <div class="infobox-label">Setting:</div>
                            <div class="infobox-value">${game.setting}</div>
                        </div>
                        ${game.engine ? `<div class="infobox-row">
                            <div class="infobox-label">Engine:</div>
                            <div class="infobox-value">${game.engine}</div>
                        </div>` : ''}
                        <div class="infobox-row">
                            <div class="infobox-label">Platforms:</div>
                            <div class="infobox-value">${game.platforms.join(', ')}</div>
                        </div>
                    </div>
                </div>

                <h2 class="section-title">${game.title}</h2>
                
                <p><strong>${game.title}</strong> is a ${game.year} ${game.genre || 'action-adventure'} game set during the ${game.setting}. ${game.description}</p>

                ${game.plot ? `
                    <h3 class="section-subtitle">Plot</h3>
                    <p>${game.plot}</p>
                ` : ''}

                ${game.gameplay ? `
                    <h3 class="section-subtitle">Gameplay</h3>
                    <p>${game.gameplay}</p>
                ` : ''}

                ${game.development ? `
                    <h3 class="section-subtitle">Development</h3>
                    <p>${game.development}</p>
                ` : ''}

                ${game.reception ? `
                    <h3 class="section-subtitle">Reception</h3>
                    <p>${game.reception}</p>
                ` : ''}

                ${game.sales ? `
                    <h3 class="section-subtitle">Sales</h3>
                    <p>${game.sales}</p>
                ` : ''}

                <p style="margin-top: 2rem;"><a href="#" class="nav-link" data-page="games" style="display: inline-block; padding: 0.5rem 1.5rem; background: var(--color-primary); color: var(--color-secondary); border-radius: 4px;">← Back to All Games</a></p>
            </div>
        `;

        document.querySelector('[data-page="games"]').addEventListener('click', (e) => {
            e.preventDefault();
            renderPage('games');
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Characters Page
    function renderCharacters(container) {
        container.innerHTML = `
            <div class="section">
                <h2 class="section-title">Characters</h2>
                
                <div class="filter-bar">
                    <div class="filter-group">
                        <span class="filter-label">Filter by Role:</span>
                        <select class="filter-select" id="char-filter">
                            <option value="all">All Roles</option>
                            <option value="Protagonist">Protagonist</option>
                            <option value="Antagonist">Antagonist</option>
                            <option value="Ally">Ally</option>
                            <option value="Deuteragonist">Deuteragonist</option>
                        </select>
                    </div>
                </div>

                <div id="chars-container" class="cards-grid">
                    ${renderCharacterCards(WIKI_DATA.characters)}
                </div>
            </div>
        `;

        document.getElementById('char-filter').addEventListener('change', (e) => {
            const filtered = e.target.value === 'all' ? WIKI_DATA.characters : 
                WIKI_DATA.characters.filter(c => c.role === e.target.value);
            document.getElementById('chars-container').innerHTML = renderCharacterCards(filtered);
        });
    }



          function renderCharacterCards(characters) {
            return characters.map(char => `
                <div class="card">
                    <div class="card-image">
                        <img src="${char.image}" alt="${char.name}">
                    </div>
                    <div class="card-content">
                        <span class="card-badge">${char.role}</span>
                        <h3 class="card-title">${char.name}</h3>
                        <p class="card-game">${char.game}</p>
                        <p class="card-description">${char.description}</p>
                    </div>
                </div>
            `).join('');
        }
    function showCharacterDetail(charId) {
        const char = WIKI_DATA.characters.find(c => c.id === charId);
        if (!char) return;

        document.getElementById('search-results').classList.remove('active');
        document.getElementById('search-input').value = '';

        const game = WIKI_DATA.games.find(g => g.id === char.gameId);
        const container = document.getElementById('main-content');

        container.innerHTML = `
            <div class="section">
                <div class="infobox">
                    <div class="infobox-header">${char.name}</div>
                    <div class="infobox-image">${char.icon} <img src="${char.image}" alt="${game.title} Cover" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;"></div>

                    <div class="infobox-content">
                        <div class="infobox-row">
                            <div class="infobox-label">Role:</div>
                            <div class="infobox-value">${char.role}</div>
                        </div>
                        ${char.era ? `<div class="infobox-row">
                            <div class="infobox-label">Era:</div>
                            <div class="infobox-value">${char.era}</div>
                        </div>` : ''}
                        <div class="infobox-row">
                            <div class="infobox-label">Game:</div>
                            <div class="infobox-value">${game ? game.title : 'Unknown'}</div>
                        </div>
                        ${char.affiliation ? `<div class="infobox-row">
                            <div class="infobox-label">Affiliation:</div>
                            <div class="infobox-value">${char.affiliation}</div>
                        </div>` : ''}
                        ${char.voiceActor ? `<div class="infobox-row">
                            <div class="infobox-label">Voice Actor:</div>
                            <div class="infobox-value">${char.voiceActor}</div>
                        </div>` : ''}
                    </div>
                </div>

                <h2 class="section-title">${char.name}</h2>
                
                <p>${char.description}</p>

                ${char.biography ? `
                    <h3 class="section-subtitle">Biography</h3>
                    <p>${char.biography}</p>
                ` : ''}

                ${char.traits ? `
                    <h3 class="section-subtitle">Character Traits</h3>
                    <p>${char.traits}</p>
                ` : ''}

                <p style="margin-top: 2rem;"><a href="#" class="nav-link" data-page="characters" style="display: inline-block; padding: 0.5rem 1.5rem; background: var(--color-primary); color: var(--color-secondary); border-radius: 4px;">← Back to Characters</a></p>
            </div>
        `;

        document.querySelector('[data-page="characters"]').addEventListener('click', (e) => {
            e.preventDefault();
            renderPage('characters');
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Timeline Page
    function renderTimeline(container) {
        container.innerHTML = `
            <div class="section">
                <h2 class="section-title">Franchise Timeline</h2>
                <p>The chronological release history of the Assassin's Creed franchise.</p>
                
                <div class="timeline">
                    ${WIKI_DATA.timeline.map((event, index) => `
                        <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
                            <div class="timeline-content">
                                <div class="timeline-year">${event.year}</div>
<h4 class="timeline-title">${event.event}</h4>
<p class="timeline-desc">${event.description}</p>
div>
                                <h4 class="timeline-title">${event.event}</h4>
                                <p class="timeline-desc">${event.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Gameplay Page
    function renderGameplay(container) {
        const gp = WIKI_DATA.gameplay;
        const org = WIKI_DATA.organizations;

        container.innerHTML = `
            <div class="section">
                <h2 class="section-title">Gameplay Systems & Lore</h2>

                <h3 class="section-subtitle">${gp.animus.title}</h3>
                <p>${gp.animus.description}</p>
                <p><strong>Features:</strong> ${gp.animus.features.join(', ')}</p>

                <h3 class="section-subtitle">${gp.eagleVision.title}</h3>
                <p>${gp.eagleVision.description}</p>
                <p><strong>Features:</strong> ${gp.eagleVision.features.join(', ')}</p>

                <h3 class="section-subtitle">${gp.socialStealth.title}</h3>
                <p>${gp.socialStealth.description}</p>
                <p><strong>Features:</strong> ${gp.socialStealth.features.join(', ')}</p>

                <h3 class="section-subtitle">${gp.parkour.title}</h3>
                <p>${gp.parkour.description}</p>
                <p><strong>Features:</strong> ${gp.parkour.features.join(', ')}</p>

                <h3 class="section-subtitle">${gp.combat.title}</h3>
                <p>${gp.combat.description}</p>
                <p><strong>Features:</strong> ${gp.combat.features.join(', ')}</p>

                <h3 class="section-subtitle">${gp.synchronization.title}</h3>
                <p>${gp.synchronization.description}</p>
                <p><strong>Features:</strong> ${gp.synchronization.features.join(', ')}</p>

                <h2 class="section-title" style="margin-top: 3rem;">Organizations & Factions</h2>

                <h3 class="section-subtitle">${org.assassins.name}</h3>
                <p><strong>Founded:</strong> ${org.assassins.founding}</p>
                <p><strong>Creed:</strong> <em>"${org.assassins.creed}"</em></p>
                <p><strong>Ideology:</strong> ${org.assassins.ideology}</p>
                <p><strong>Three Tenets:</strong></p>
                <ul>
                    ${org.assassins.tenets.map(t => `<li>${t}</li>`).join('')}
                </ul>
                <p>${org.assassins.description}</p>

                <h3 class="section-subtitle">${org.templars.name}</h3>
                <p><strong>Ideology:</strong> ${org.templars.ideology}</p>
                <p><strong>Modern Front:</strong> ${org.templars.modernFront}</p>
                <p>${org.templars.description}</p>

                <h3 class="section-subtitle">${org.isu.name}</h3>
                <p><strong>Era:</strong> ${org.isu.era}</p>
                <p>${org.isu.description}</p>
                <p><strong>Known Artifacts:</strong> ${org.isu.artifacts.join(', ')}</p>
                <p><strong>Notable Isu:</strong> ${org.isu.notableIsu.join(', ')}</p>
            </div>
        `;
    }
