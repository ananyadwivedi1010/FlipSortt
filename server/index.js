
import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/scrape', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true, // "new" is the default in newer versions, but "true" is safer for compatibility
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
            defaultViewport: { width: 1920, height: 1080 }
        });

        // Check if browser launched successfully
        if (!browser) {
            throw new Error('Failed to launch browser');
        }

        const page = await browser.newPage();

        // Set User Agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        } catch (navError) {
            console.error("Navigation error:", navError);
        }

        // --- Scroll logic ---
        try {
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    const distance = 150;
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= 4000 || totalHeight >= scrollHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });

            // NEW: Explicitly wait for the "Ratings" text to appear in the body
            try {
                await page.waitForFunction(
                    () => document.body.innerText.includes("Ratings"),
                    { timeout: 5000 }
                );
            } catch (e) { console.log("Timeout waiting for 'Ratings' text"); }

            // Wait longer for lazy load
            await new Promise(r => setTimeout(r, 4000));
        } catch (e) { console.log("Scroll failed:", e); }

        // Wait for selector - typical Flipkart price container
        // Using a more generic wait or shorter timeout to not block too long
        // Wait for body to ensure page loaded
        try {
            await page.waitForSelector('body', { timeout: 10000 });
            const title = await page.title();
            console.log(`Page Title: ${title}`);
        } catch (e) {
            console.log("Page load timeout or body not found");
        }

        const data = await page.evaluate(() => {
            const getText = (selector) => document.querySelector(selector)?.textContent?.trim() || '';
            const getAttribute = (selector, attr) => document.querySelector(selector)?.getAttribute(attr) || '';
            const fullPageText = document.body.innerText; // Get full text once

            // --- Helper: Find by Text Content (Regex) --- 
            // This is much more robust against class name changes
            const findTextContent = (regex, limit = 100) => {
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                let node;
                let count = 0;
                while ((node = walker.nextNode()) && count < limit * 50) { // Safety limit
                    if (regex.test(node.textContent)) {
                        // Return the text or the parent element text
                        return node.textContent.trim();
                    }
                    count++;
                }
                return null;
            };

            // 0. JSON-LD STRUCTURAL DATA (Gold Standard)
            let jsonLdData = {};
            try {
                const scripts = document.querySelectorAll('script[type="application/ld+json"]');
                scripts.forEach(script => {
                    try {
                        const json = JSON.parse(script.innerText);
                        if (json['@type'] === 'Product') {
                            jsonLdData = json;
                        }
                        // Sometimes it's a list containing the product
                        if (Array.isArray(json)) {
                            const product = json.find(i => i['@type'] === 'Product');
                            if (product) jsonLdData = product;
                        }
                    } catch (e) { }
                });
            } catch (e) { console.log('JSON-LD extraction error', e); }

            // 1. NAME
            let name = jsonLdData.name || getText('span.B_NuCI') || getText('span.VU-ZEz') || getText('h1._6EBuvT') || getText('.yhB1nd');

            // 2. PRICE
            let price = 0;
            // Strategy 0: JSON-LD
            if (jsonLdData.offers && jsonLdData.offers.price) {
                price = parseInt(jsonLdData.offers.price);
            }

            // Strategy 1: Selectors
            if (price === 0) {
                let priceText = getText('div._30jeq3._16Jk6d') || getText('div.Nx9bqj') || getText('div._30jeq3') || getText('div.CxhGGd');
                if (priceText) {
                    const match = priceText.match(/([0-9,]+)/);
                    if (match) price = parseInt(match[1].replace(/,/g, ''));
                }
            }

            // Strategy 2: Regex Fallback (Ignore discounts)
            if (price < 100) {
                const matches = fullPageText.matchAll(/₹\s*([0-9,]+)(?!\s*(?:off|%))/gi);
                for (const m of matches) {
                    const val = parseInt(m[1].replace(/,/g, ''));
                    // valid price range: > 500 and < 10,00,000 (10 lakhs)
                    if (val > 500 && val < 1000000) {
                        if (price === 0) price = val;
                        break;
                    }
                }
            }

            // 3. RATING
            let rating = 0.0;
            // Strategy 0: JSON-LD
            if (jsonLdData.aggregateRating && jsonLdData.aggregateRating.ratingValue) {
                rating = parseFloat(jsonLdData.aggregateRating.ratingValue);
            }

            if (rating === 0) {
                let ratingText = getText('div._3LWZlK') || getText('div.XQDdHH');
                rating = parseFloat(ratingText) || 0.0;
            }

            // Fallback: Regex search for "4.6 ★" pattern
            if (rating === 0) {
                const ratingMatch = fullPageText.match(/([0-5]\.[0-9])\s*★/);
                if (ratingMatch) rating = parseFloat(ratingMatch[1]);
            }

            // 4. REVIEWS & RATINGS
            let ratingCount = 0;
            let reviewCount = 0;

            // Strategy 0: JSON-LD
            if (jsonLdData.aggregateRating) {
                if (jsonLdData.aggregateRating.reviewCount) reviewCount = parseInt(jsonLdData.aggregateRating.reviewCount);
                if (jsonLdData.aggregateRating.ratingCount) ratingCount = parseInt(jsonLdData.aggregateRating.ratingCount);
            }

            // Strategy 1: Regex
            if (ratingCount === 0) {
                const ratingMatch = fullPageText.match(/([0-9,]+)\s+Ratings/i);
                if (ratingMatch) ratingCount = parseInt(ratingMatch[1].replace(/,/g, ''));
            }
            if (reviewCount === 0) {
                const reviewMatch = fullPageText.match(/([0-9,]+)\s+Reviews/i);
                if (reviewMatch) reviewCount = parseInt(reviewMatch[1].replace(/,/g, ''));
            }

            // 5. IMAGE
            let image = '';
            // Strategy 0: JSON-LD
            if (jsonLdData.image) {
                // Sometimes it's a string, sometimes an array, sometimes an object
                if (typeof jsonLdData.image === 'string') image = jsonLdData.image;
                else if (Array.isArray(jsonLdData.image)) image = jsonLdData.image[0];
                else if (jsonLdData.image.url) image = jsonLdData.image.url;
            }

            // Strategy 1: Selectors
            if (!image) {
                image = getAttribute('img._396cs4', 'src') || getAttribute('img.DByuf4', 'src') || '';
            }

            // Strategy 2: Open Graph
            if (!image) {
                image = getAttribute('meta[property="og:image"]', 'content') || '';
            }

            const description = jsonLdData.description || getText('div._1mXcCf') || getText('div.yN+eNk') || '';

            // 6. DETAILED RATINGS (Histogram)
            const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            try {
                // Scan full text for patterns like: "5 ★ 2,345" or "5★\n2,345"
                // We use global match to find all occurrences
                const starLines = fullPageText.match(/[1-5]\s*★[\s\S]{0,20}?[0-9,]+/g) || [];

                starLines.forEach(line => {
                    const starMatch = line.match(/([1-5])\s*★/);
                    const countMatch = line.match(/([0-9,]+)$/); // Number at the very end of the matched string

                    if (starMatch && countMatch) {
                        const star = parseInt(starMatch[1]);
                        const count = parseInt(countMatch[1].replace(/,/g, ''));
                        // Sanity check
                        if (star >= 1 && star <= 5) {
                            // Only update if current is 0 to avoid overwriting with bad data, 
                            // or update if count is larger (better capture)
                            if (count > ratingBreakdown[star]) {
                                ratingBreakdown[star] = count;
                            }
                        }
                    }
                });
            } catch (e) { console.log('Rating breakdown extraction failed', e); }

            // 6b. FEATURE RATINGS (Camera, Battery, etc.)
            const featureRatings = [];
            try {
                const featuresToCheck = ['Camera', 'Battery', 'Display', 'Design', 'Performance', 'Value'];
                // Regex strategies:
                // 1. "Camera 4.5" (Label then Score)
                // 2. "4.5 Camera" (Score then Label) - Common in circular UIs
                // 3. "Camera\n4.5" (Label newline Score)

                featuresToCheck.forEach(feature => {
                    // Pattern A: Feature followed by rating (within 20 chars)
                    const regexA = new RegExp(`${feature}[\\s\\S]{0,20}?([0-5]\\.[0-9])`, 'i');
                    // Pattern B: Rating followed by feature (within 20 chars)
                    const regexB = new RegExp(`([0-5]\\.[0-9])[\\s\\S]{0,20}?${feature}`, 'i');

                    let match = fullPageText.match(regexA);
                    let rating = 0;

                    if (match) {
                        rating = parseFloat(match[1]);
                    } else {
                        match = fullPageText.match(regexB);
                        if (match) {
                            rating = parseFloat(match[1]);
                        }
                    }

                    if (rating > 0) {
                        featureRatings.push({ name: feature, rating });
                    }
                });
            } catch (e) { console.log('Feature rating extraction failed', e); }

            // 7. REVIEW TEXTS (Scrape first 5-10 reviews)
            const recentReviews = [];
            try {
                // Strategy 1: Common Class Names (2024/2025)
                const reviewContentSelectors = ['.t-ZTKy', '.ZmyHeo', '.qwjRop'];
                let contentNodes = [];
                for (const sel of reviewContentSelectors) {
                    const found = document.querySelectorAll(sel);
                    if (found.length > 0) {
                        contentNodes = Array.from(found);
                        break;
                    }
                }

                // Strategy 2: Look for 'READ MORE' and get parent
                if (contentNodes.length === 0) {
                    const readMores = Array.from(document.querySelectorAll('span, div')).filter(el => el.textContent === 'READ MORE');
                    contentNodes = readMores.map(el => el.parentElement?.parentElement).filter(Boolean);
                }

                contentNodes.forEach((node, i) => {
                    if (i > 8) return;
                    const content = node.textContent?.replace('READ MORE', '').trim() || '';
                    if (content.length > 10) { // Filter out short garbage
                        // Try to find rating near this node
                        // Go up 3-4 levels and look for star rating
                        let rating = 5; // Default
                        let parent = node.parentElement;
                        for (let k = 0; k < 4; k++) {
                            if (!parent) break;
                            const starNode = parent.querySelector('div._3LWZlK, div.XQDdHH');
                            if (starNode) {
                                rating = parseFloat(starNode.textContent) || 5;
                                break;
                            }
                            parent = parent.parentElement;
                        }

                        recentReviews.push({ title: 'Review', content, rating });
                    }
                });
            } catch (e) { console.log('Review text extraction failed', e); }

            const result = {
                name: name || document.title,
                price,
                rating,
                ratingCount,
                reviewCount,
                image,
                description,
                ratingBreakdown,
                featureRatings,
                recentReviews
            };
            return result;
        });

        console.log("Extracted Data:", JSON.stringify(data, null, 2));

        await browser.close();

        if (!data.name && !data.price) {
            console.error("Scrape failed. Page Title:", await page.title());
            // Log first 200 chars to see if it's an Access Denied / Login page
            const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
            console.error("Page Body Preview:", bodyText);

            return res.status(500).json({ error: 'Failed to extract data. Valid Flipkart URL?' });
        }

        res.json(data);

    } catch (error) {
        console.error('Scrape Error:', error);
        res.status(500).json({ error: error.message || 'Scraping failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
