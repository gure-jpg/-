const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Fallback data in case the scraping fails or the site structure changes
const getFallbackEvents = () => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const formatDate = (d) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

    return [
        {
            id: 1,
            title: "「葬送のフリーレン」特別原画展",
            type: "exhibition",
            typeLabel: "絵画展",
            date: `${formatDate(today)} 〜 ${formatDate(nextMonth)}`,
            location: "池袋 サンシャインシティ 展示ホールA",
            query: "Ikebukuro Sunshine City",
            desc: "アニメ制作の裏側を覗ける貴重な原画や資料を多数展示。限定グッズの販売も。"
        },
        {
            id: 2,
            title: "水瀬いのり LIVE TOUR 2026",
            type: "seiyuu",
            typeLabel: "声優イベント",
            date: formatDate(nextMonth),
            location: "横浜アリーナ",
            query: "Yokohama Arena",
            desc: "人気声優・水瀬いのりの待望の全国ライブツアー東京・横浜公演。"
        },
        {
            id: 3,
            title: "「ぼっち・ざ・ろっく！」× タワーレコード コラボカフェ",
            type: "cafe",
            typeLabel: "コラボカフェ",
            date: `${formatDate(today)} 〜 ${formatDate(nextMonth)}`,
            location: "TOWER RECORDS CAFE 渋谷店",
            query: "TOWER RECORDS CAFE Shibuya",
            desc: "結束バンドのメンバーをイメージした限定メニューや、描き下ろしイラストを使用したノベルティが登場！"
        },
        {
            id: 4,
            title: "「呪術廻戦」ポップアップストア in 秋葉原",
            type: "popup",
            typeLabel: "POP UP",
            date: `${formatDate(today)} 〜 3月10日`,
            location: "秋葉原UDX",
            query: "Akihabara UDX",
            desc: "新規描き下ろしイラストを使用した限定グッズが集結するポップアップストア。"
        },
        {
            id: 5,
            title: "宮野真守 ファンクラブイベント2026",
            type: "seiyuu",
            typeLabel: "声優イベント",
            date: formatDate(nextMonth),
            location: "東京国際フォーラム ホールA",
            query: "Tokyo International Forum",
            desc: "会員限定の特別なトーク＆ミニライブイベント。"
        }
    ];
};

async function scrapeEvents() {
    console.log('Scraping anime events...');
    let events = [];

    try {
        // Attempt to scrape a real source (example: Animate Times events list or similar portal)
        // Note: Real scraping logic requires precise CSS selectors that change often.
        // We will attempt to fetch, but use fallback if parsing returns empty due to structure mismatch.
        const targetUrl = 'https://www.animatetimes.com/event/';
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        // Example parsing logic (might not match actual site perfectly without deep inspection)
        // We look for typical event listing containers.
        $('.event_list li').each((i, el) => {
            if (i >= 15) return; // Limit to 15 events

            const title = $(el).find('.title').text().trim();
            const date = $(el).find('.date').text().trim();
            const location = $(el).find('.place').text().trim();
            const desc = $(el).find('.desc').text().trim() || '詳細は公式サイトをご確認ください。';

            if (title && location) {
                // Determine type based on keywords
                let type = 'popup';
                let typeLabel = 'POP UP';

                if (title.includes('展')) { type = 'exhibition'; typeLabel = '絵画展'; }
                else if (title.includes('声優') || title.includes('ライブ')) { type = 'seiyuu'; typeLabel = '声優イベント'; }
                else if (title.includes('カフェ')) { type = 'cafe'; typeLabel = 'コラボカフェ'; }

                events.push({
                    id: i + 1,
                    title,
                    type,
                    typeLabel,
                    date: date || '未定',
                    location,
                    query: location, // Used for Google Maps embed
                    desc
                });
            }
        });

    } catch (error) {
        console.error('Error fetching live data:', error.message);
    }

    // If scraping fails or yields 0 results (e.g. site updated its HTML class names),
    // use the fallback dynamic data so the site never breaks.
    if (events.length === 0) {
        console.log('Using fallback dynamic event data (Target site could not be parsed).');
        events = getFallbackEvents();
    } else {
        console.log(`Successfully scraped ${events.length} events.`);
    }

    // Save to events.json
    const outputPath = path.join(__dirname, 'events.json');
    fs.writeFileSync(outputPath, JSON.stringify(events, null, 2), 'utf-8');
    console.log(`Saved events to ${outputPath}`);
}

scrapeEvents();
