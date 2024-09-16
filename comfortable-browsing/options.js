// 定数
const REMOVE_ADS_INPUT_ID = 'removeAdsUrlInput';
const REMOVE_ADS_SAVE_BTN_ID = 'removeAdsUrlSaveBtn';
const REMOVE_ADS_LIST_ID = 'removeAdsUrlList';
const REMOVE_ADS_STORAGE_KEY = 'removeAdsUrls';

const ENABLE_ADS_BLOCK_INPUT_ID = 'enableAdsBlockUrlInput';
const ENABLE_ADS_BLOCK_SAVE_BTN_ID = 'enableAdsBlockUrlSaveBtn';
const ENABLE_ADS_BLOCK_LIST_ID = 'enableAdsBlockUrlList';
const ENABLE_ADS_BLOCK_STORAGE_KEY = 'enableAdsBlockUrls';

// 汎用的にURLを保存する関数
function saveUrl(inputId, storageKey, displayFunction) {
    const urlInput = document.getElementById(inputId);
    const urlValue = urlInput.value;

    if (urlValue) {
        chrome.storage.sync.get(storageKey, (data) => {
            const urls = data[storageKey] || [];

            // 重複チェック
            if (urls.includes(urlValue)) {
                alert('このURLはすでに保存されています。');
            } else {
                urls.push(urlValue);
                
                // URLを保存
                chrome.storage.sync.set({ [storageKey]: urls }, () => {
                    // 入力フィールドを空にする
                    urlInput.value = '';
                    
                    // URLリストを再表示
                    displayFunction();
                });
            }
        });
    }
}

// 汎用的にURLリストを表示する関数
function displayUrls(storageKey, listId, deleteFunction) {
    chrome.storage.sync.get(storageKey, (data) => {
        const urlList = document.getElementById(listId);
        urlList.innerHTML = '';

        (data[storageKey] || []).forEach((url, index) => {
            const li = document.createElement('li');
            li.textContent = url;

            // 削除ボタンを追加
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.style.marginLeft = '10px';

            // 削除ボタンのクリックイベント
            deleteButton.addEventListener('click', () => {
                deleteFunction(index);
            });

            li.appendChild(deleteButton);
            urlList.appendChild(li);
        });
    });
}

// 汎用的にURLを削除する関数
function deleteUrl(index, storageKey, displayFunction) {
    chrome.storage.sync.get(storageKey, (data) => {
        const urls = data[storageKey] || [];

        if (index > -1) {
            urls.splice(index, 1);
        }

        chrome.storage.sync.set({ [storageKey]: urls }, () => {
            displayFunction();
        });
    });
}

// Remove Ads のリストと保存機能
document.getElementById(REMOVE_ADS_SAVE_BTN_ID).addEventListener('click', () => {
    saveUrl(REMOVE_ADS_INPUT_ID, REMOVE_ADS_STORAGE_KEY, displayRemoveAdsUrls);
});

function displayRemoveAdsUrls() {
    displayUrls(REMOVE_ADS_STORAGE_KEY, REMOVE_ADS_LIST_ID, (index) => {
        deleteUrl(index, REMOVE_ADS_STORAGE_KEY, displayRemoveAdsUrls);
    });
}

// Enable Ads Block のリストと保存機能
document.getElementById(ENABLE_ADS_BLOCK_SAVE_BTN_ID).addEventListener('click', () => {
    saveUrl(ENABLE_ADS_BLOCK_INPUT_ID, ENABLE_ADS_BLOCK_STORAGE_KEY, displayEnableAdsBlockUrls);
});

function displayEnableAdsBlockUrls() {
    displayUrls(ENABLE_ADS_BLOCK_STORAGE_KEY, ENABLE_ADS_BLOCK_LIST_ID, (index) => {
        deleteUrl(index, ENABLE_ADS_BLOCK_STORAGE_KEY, displayEnableAdsBlockUrls);
    });
}

// 初期表示
displayRemoveAdsUrls();
displayEnableAdsBlockUrls();
