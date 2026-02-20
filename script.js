// Event Data (Focus: Japanese Anime)
const events = [
    {
        id: 1,
        title: "「葬送のフリーレン」特別原画展",
        type: "exhibition",
        typeLabel: "絵画展",
        date: "2026年3月15日 〜 4月10日",
        location: "池袋 サンシャインシティ 展示ホールA",
        query: "Ikebukuro Sunshine City",
        desc: "アニメ制作の裏側を覗ける貴重な原画や資料を多数展示。限定グッズの販売も。"
    },
    {
        id: 2,
        title: "水瀬いのり LIVE TOUR 2026",
        type: "seiyuu",
        typeLabel: "声優イベント",
        date: "2026年4月5日(日)",
        location: "横浜アリーナ",
        query: "Yokohama Arena",
        desc: "人気声優・水瀬いのりの待望の全国ライブツアー東京・横浜公演。"
    },
    {
        id: 3,
        title: "「ぼっち・ざ・ろっく！」× タワーレコード コラボカフェ",
        type: "cafe",
        typeLabel: "コラボカフェ",
        date: "2026年2月20日 〜 3月25日",
        location: "TOWER RECORDS CAFE 渋谷店",
        query: "TOWER RECORDS CAFE Shibuya",
        desc: "結束バンドのメンバーをイメージした限定メニューや、描き下ろしイラストを使用したノベルティが登場！"
    },
    {
        id: 4,
        title: "「呪術廻戦」ポップアップストア in 秋葉原",
        type: "popup",
        typeLabel: "POP UP",
        date: "2026年2月25日 〜 3月10日",
        location: "秋葉原UDX",
        query: "Akihabara UDX",
        desc: "新規描き下ろしイラストを使用した限定グッズが集結するポップアップストア。"
    },
    {
        id: 5,
        title: "宮野真守 ファンクラブイベント2026",
        type: "seiyuu",
        typeLabel: "声優イベント",
        date: "2026年5月10日(日)",
        location: "東京国際フォーラム ホールA",
        query: "Tokyo International Forum",
        desc: "会員限定の特別なトーク＆ミニライブイベント。"
    },
    {
        id: 6,
        title: "「推しの子」展 嘘と本当",
        type: "exhibition",
        typeLabel: "絵画展",
        date: "2026年3月1日 〜 3月31日",
        location: "松屋銀座 8階イベントスクエア",
        query: "Matsuya Ginza",
        desc: "アイの衣装再現や、名シーンの立体展示などを楽しめる大規模展覧会。"
    }
];

// Icons
const calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg>`;
const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
const descIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/></svg>`;

// Generate Google Maps Embed URL
const getMapEmbedUrl = (query) => {
    const encodedQuery = encodeURIComponent(query);
    // Standard basic embed approach for Google Maps
    return `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};

// Fetch Event Data from JSON
let allEvents = [];

const fetchEvents = async () => {
    try {
        const response = await fetch('events.json');
        if (!response.ok) throw new Error('Network response was not ok');
        allEvents = await response.json();
    } catch (error) {
        console.error('Failed to fetch events.json, falling back to local static array:', error);
        allEvents = events; // fallback to the hardcoded array if events.json doesn't exist yet
    }
};

// Render Event Cards
const renderEvents = (filterType = 'all') => {
    const grid = document.getElementById('events-grid');
    grid.innerHTML = '';

    const filteredEvents = filterType === 'all'
        ? allEvents
        : allEvents.filter(event => event.type === filterType);

    filteredEvents.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.style.animationDelay = `${index * 0.1}s`; // Staggered animation

        card.innerHTML = `
            <div class="card-map">
                <iframe src="${getMapEmbedUrl(event.query)}" loading="lazy"></iframe>
            </div>
            <div class="card-content">
                <span class="card-tag tag-${event.type}">${event.typeLabel}</span>
                <h3 class="card-title">${event.title}</h3>
                
                <div class="card-info">
                    ${calendarIcon}
                    <span>${event.date}</span>
                </div>
                
                <div class="card-info">
                    ${locationIcon}
                    <span>${event.location}</span>
                </div>

                <div class="card-info" style="margin-top: 10px;">
                    ${descIcon}
                    <span style="font-size: 0.85rem;">${event.desc}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
};

// Event Listeners for Filters
document.addEventListener('DOMContentLoaded', async () => {
    await fetchEvents(); // Load JSON data first
    renderEvents(); // Initial render

    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add to clicked
            e.target.classList.add('active');

            // Re-render
            const filterType = e.target.getAttribute('data-filter');
            renderEvents(filterType);
        });
    });
});
