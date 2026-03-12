import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait extra seconds for potential client-side hydration or animations
        await new Promise(resolve => setTimeout(resolve, 3000));

        const result = await page.evaluate(() => {
            const getComputed = (el, prop) => {
                if (!el) return null;
                return window.getComputedStyle(el).getPropertyValue(prop);
            };

            const getPseudo = (el, pseudo, prop) => {
                if (!el) return null;
                return window.getComputedStyle(el, pseudo).getPropertyValue(prop);
            };

            const formatPseudoParams = (el, pseudo) => {
                if (!el) return null;
                const content = getPseudo(el, pseudo, 'content');
                if (!content || content === 'none') return null;
                return {
                    content,
                    height: getPseudo(el, pseudo, 'height'),
                    position: getPseudo(el, pseudo, 'position'),
                    backgroundColor: getPseudo(el, pseudo, 'background-color'),
                    bottom: getPseudo(el, pseudo, 'bottom'),
                };
            };

            const reports = {};

            // 1. FULL DOM LAYOUT TREE
            const climb = (node, maxDepth = 15) => {
                if (!node || maxDepth <= 0) return null;
                if (node.nodeType !== Node.ELEMENT_NODE) return null;
                const tag = node.tagName.toLowerCase();
                if (tag === 'script' || tag === 'style' || tag === 'noscript') return null;

                const classes = Array.from(node.classList || []).join('.');
                let label = tag + (classes ? `.${classes}` : '');
                const height = node.offsetHeight;

                const rawChildren = Array.from(node.children)
                    .map(c => climb(c, maxDepth - 1))
                    .filter(Boolean);
                
                // Flatten structural nodes if they are just divs without height impact
                // Keep body, main, footer, header, nav, or anything with significant height or flex
                const isSignificant = ['body', 'main', 'footer', 'header', 'nav', 'section'].includes(tag) || 
                                      height > 50 || 
                                      getComputed(node, 'display') === 'flex' || 
                                      getComputed(node, 'display') === 'grid';
                
                if (isSignificant || rawChildren.length > 1) {
                    return { label, height, ...(rawChildren.length && { children: rawChildren }) };
                }

                return rawChildren.length === 1 ? rawChildren[0] : null;
            };
            
            reports.domLayoutTree = climb(document.body);

            // 2. DOCUMENT HEIGHT METRICS
            reports.documentHeightMetrics = {
                bodyScrollHeight: document.body.scrollHeight,
                bodyOffsetHeight: document.body.offsetHeight,
                documentElementClientHeight: document.documentElement.clientHeight,
                windowInnerHeight: window.innerHeight,
            };

            // 3. FOOTER METRICS
            const footer = document.querySelector('footer');
            if (footer) {
                const footerParent = footer.parentElement;
                reports.footerMetrics = {
                    computedHeight: getComputed(footer, 'height'),
                    actualHeight: footer.offsetHeight,
                    marginTop: getComputed(footer, 'margin-top'),
                    marginBottom: getComputed(footer, 'margin-bottom'),
                    paddingBottom: getComputed(footer, 'padding-bottom'),
                    position: getComputed(footer, 'position'),
                    zIndex: getComputed(footer, 'z-index'),
                    parentStyles: footerParent ? {
                        tag: footerParent.tagName.toLowerCase(),
                        display: getComputed(footerParent, 'display'),
                        flexDirection: getComputed(footerParent, 'flex-direction'),
                        height: getComputed(footerParent, 'height'),
                        minHeight: getComputed(footerParent, 'min-height'),
                        paddingBottom: getComputed(footerParent, 'padding-bottom')
                    } : null
                };
            } else {
                reports.footerMetrics = null;
            }

            // 4. PSEUDO ELEMENTS
            const main = document.querySelector('main');
            const body = document.body;
            // Assume layoutWrapper is the element right inside body that wraps everything
            const layoutWrapper = document.body.firstElementChild; // often a div
            
            reports.pseudoElements = {
                footer: footer ? { before: formatPseudoParams(footer, '::before'), after: formatPseudoParams(footer, '::after') } : null,
                main: main ? { before: formatPseudoParams(main, '::before'), after: formatPseudoParams(main, '::after') } : null,
                body: { before: formatPseudoParams(body, '::before'), after: formatPseudoParams(body, '::after') },
                layoutWrapper: layoutWrapper ? { tag: layoutWrapper.tagName.toLowerCase(), before: formatPseudoParams(layoutWrapper, '::before'), after: formatPseudoParams(layoutWrapper, '::after') } : null,
            };

            // 5. LAST PAGE ELEMENT
            let lastElementForSearch = layoutWrapper;
            let lastPageElement = null;
            if (footer && footer.previousElementSibling) {
                lastPageElement = footer.previousElementSibling;
            } else if (main && main.lastElementChild && main !== footer) {
                lastPageElement = main.lastElementChild;
            } else {
                lastPageElement = layoutWrapper && layoutWrapper.lastElementChild !== footer 
                    ? layoutWrapper.lastElementChild 
                    : (document.body.lastElementChild !== footer ? document.body.lastElementChild : null);
            }

            if (lastPageElement) {
                reports.lastPageElement = {
                    tag: lastPageElement.tagName.toLowerCase(),
                    classes: lastPageElement.className,
                    marginBottom: getComputed(lastPageElement, 'margin-bottom'),
                    paddingBottom: getComputed(lastPageElement, 'padding-bottom'),
                    height: getComputed(lastPageElement, 'height'),
                    actualHeight: lastPageElement.offsetHeight,
                };
            } else {
                reports.lastPageElement = null;
            }

            // 6. SAFE AREA PADDING
            let safeAreaElements = [];
            // Just scan body and major children
            const toScan = [document.body, layoutWrapper, main, footer].filter(Boolean);
            toScan.forEach(el => {
                const className = typeof el.className === 'string' ? el.className : '';
                const pBottom = getComputed(el, 'padding-bottom');
                if (className.includes('pb-safe') || className.includes('safe-p-bottom') || (pBottom && pBottom.includes('env'))) {
                    safeAreaElements.push({
                        tag: el.tagName.toLowerCase(),
                        classes: className,
                        computedPaddingBottom: pBottom
                    });
                }
            });
            reports.safeAreaPadding = safeAreaElements;

            // 7. FLEX LAYOUT ANALYSIS
            const pageWrapper = layoutWrapper || document.body;
            reports.flexLayoutAnalysis = {
                wrapper: {
                    tag: pageWrapper.tagName.toLowerCase(),
                    classes: pageWrapper.className,
                    display: getComputed(pageWrapper, 'display'),
                    flexDirection: getComputed(pageWrapper, 'flex-direction'),
                    minHeight: getComputed(pageWrapper, 'min-height'),
                    height: pageWrapper.offsetHeight,
                    computedHeight: getComputed(pageWrapper, 'height')
                },
                children: Array.from(pageWrapper.children).map(c => ({
                    tag: c.tagName.toLowerCase(),
                    classes: c.className,
                    display: getComputed(c, 'display'),
                    flexGrow: getComputed(c, 'flex-grow'),
                    flexShrink: getComputed(c, 'flex-shrink'),
                    flexBasis: getComputed(c, 'flex-basis'),
                    computedHeight: getComputed(c, 'height'),
                    actualHeight: c.offsetHeight,
                    marginBottom: getComputed(c, 'margin-bottom'),
                }))
            };

            // 8. EXTRA SPACE SOURCE
            // We search for elements or bottom coordinates that stretch past windowInnerHeight
            // or past the layout wrapper.
            let bottomMostElements = [];
            document.querySelectorAll('body *').forEach(el => {
                if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                if (rect.bottom > 10 && el.offsetHeight > 0) {
                    bottomMostElements.push({
                        tag: el.tagName.toLowerCase(),
                        classes: el.className,
                        bottom: rect.bottom,
                        height: el.offsetHeight,
                        marginBottom: style.marginBottom,
                        paddingBottom: style.paddingBottom,
                        position: style.position,
                        zIndex: style.zIndex
                    });
                }
            });
            // Sort by bottom coord descending
            bottomMostElements.sort((a,b) => b.bottom - a.bottom);
            reports.extraSpaceCandidates = bottomMostElements.slice(0, 5);

            // Check if body or HTML has background that is showing through at bottom
            reports.visualGapIdentification = {
                htmlBg: window.getComputedStyle(document.documentElement).backgroundColor,
                bodyBg: window.getComputedStyle(document.body).backgroundColor,
                layoutWrapperBg: layoutWrapper ? window.getComputedStyle(layoutWrapper).backgroundColor : null,
                footerBg: footer ? window.getComputedStyle(footer).backgroundColor : null,
                footerMarginBottom: footer ? window.getComputedStyle(footer).getPropertyValue('margin-bottom') : '0px',
                bodyMarginBottom: window.getComputedStyle(document.body).getPropertyValue('margin-bottom'),
                bodyPaddingBottom: window.getComputedStyle(document.body).getPropertyValue('padding-bottom')
            };

            return reports;
        });

        console.log("=== INSPECT RESULT JSON ===");
        console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error("Error during evaluation:", err);
    } finally {
        await browser.close();
    }
})();
