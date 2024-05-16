async function fetchNews() {
    try {
        const response = await fetch('https://www.ts.cn/home/sjjj/index.shtml');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const newsList = doc.querySelectorAll('.mb-5');

        let newsData = [];
        newsList.forEach((news, index) => {
            if (index >= 20) return;
            const titleElement = news.querySelector('h4.card-title a');
            const title = titleElement.textContent.trim();
            const link = 'https://www.ts.cn' + titleElement.getAttribute('href').replace('../../', '/');
            const source = news.querySelector('div.badge.badge-info').textContent.trim();
            const date = news.querySelector('span.badge.badge-light').textContent.trim();

            newsData.push({ title, link, source, date });
        });

        displayNews(newsData);
    } catch (error) {
        console.error(error);
    }
}

function displayNews(newsData) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';
    newsData.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <h5><a href="${news.link}" target="_blank">${news.title}</a></h5>
            <p><strong>来源:</strong> ${news.source}</p>
            <p><strong>日期:</strong> ${news.date}</p>
        `;
        newsList.appendChild(newsItem);
    });
}

// 页面加载时爬取新闻
window.onload = fetchNews;


