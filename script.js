document.addEventListener('DOMContentLoaded', () => {
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
                const originalIcon = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                btn.style.background = '#66ff66';
                btn.style.color = '#1a1a2e';
                btn.style.borderColor = '#66ff66';
                setTimeout(() => {
                    btn.innerHTML = originalIcon;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });
    });

    const statusDot = document.querySelector('.status-dot');
    const onlineCount = document.querySelector('.online-count');
    const serverVersion = document.querySelector('.server-version');

    function fetchServerStatus() {
        const apis = [
            'https://api.mcsrvstat.us/2/rszx.fun',
            'https://api.mcsrvstat.us/2/rszx.fun:25565'
        ];

        let tried = 0;

        function tryNextAPI() {
            if (tried >= apis.length) {
                console.log('所有 API 都失败了');
                return;
            }

            fetch(apis[tried])
                .then(response => response.json())
                .then(data => {
                    if (data.online) {
                        statusDot.classList.add('online');
                        const players = data.players ? data.players.online : 0;
                        const maxPlayers = data.players ? data.players.max : 0;
                        onlineCount.textContent = players + ' / ' + maxPlayers;
                        
                        if (data.version) {
                            const cleanVersion = data.version.replace(/§[0-9a-fk-or]/gi, '').trim();
                            serverVersion.textContent = cleanVersion;
                        }
                    } else {
                        statusDot.classList.remove('online');
                        onlineCount.textContent = '0';
                    }
                })
                .catch(err => {
                    console.error('API ' + tried + ' 失败:', err);
                    tried++;
                    tryNextAPI();
                });
        }

        tryNextAPI();
    }

    fetchServerStatus();
    setInterval(fetchServerStatus, 30000);
});