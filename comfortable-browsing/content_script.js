// 定数
const REMOVE_ADS_STORAGE_KEY = 'removeAdsUrls';
const ENABLE_ADS_BLOCK_STORAGE_KEY = 'enableAdsBlockUrls';

/**
 * 画面を覆う広告を削除
 */
chrome.storage.sync.get(REMOVE_ADS_STORAGE_KEY, (data) => {
    const userUrls = data[REMOVE_ADS_STORAGE_KEY] || [];

    // 現在のページURLがユーザー指定のURLに含まれているか確認
    const currentUrl = window.location.href;
    const shouldRunScript = userUrls.some(url => currentUrl.includes(url));

    if (shouldRunScript) {
        // 広告が全て表示されてから処理を行いたいのでsetTimeoutを使用
        setTimeout(() => {
            // adsbygoogleまたはadsbygoogle-noablateクラスを持つins要素を全て取得
            const adsElements = document.querySelectorAll('ins.adsbygoogle, ins.adsbygoogle-noablate');
            
            // 取得した要素をループして削除
            adsElements.forEach(element => {
                element.remove();
            });
            console.log(adsElements)

        }, 1000)
    }
});

/**
 * 広告ブロックを使用しているブラウザが閲覧不可のサイトを閲覧できるようにする
 */
chrome.storage.sync.get(ENABLE_ADS_BLOCK_STORAGE_KEY, (data) => {
    const userUrls = data[ENABLE_ADS_BLOCK_STORAGE_KEY] || [];
    // 現在のページURLがユーザー指定のURLに含まれているか確認
    const currentUrl = window.location.href;
    const shouldRunScript = userUrls.some(url => currentUrl.includes(url));

    if (shouldRunScript) {
        // container要素を取得
        const container = document.getElementById("container");

        // containerの次の要素を取得
        const nextElement = container.nextElementSibling;

        // 次の要素が存在し、かつdiv要素であれば削除
        if (nextElement && nextElement.tagName.toLowerCase() === 'div') {
            nextElement.remove();
        }
    }
});