// ユーザー管理関連の関数
class UserManager {
    constructor() {
        this.currentUser = null;
    }

    // 現在のユーザー名を取得（将来的にサーバーサイドから取得）
    getCurrentUserName() {
        // 現在はローカルストレージから取得（仮実装）
        // 将来的にはAPIから取得する予定
        return localStorage.getItem('userName') || '冒険者';
    }

    // ユーザー名を設定
    setCurrentUserName(userName) {
        localStorage.setItem('userName', userName);
        this.currentUser = userName;
    }

    // ログイン状態をチェック
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // ログイン処理
    login(userName) {
        this.setCurrentUserName(userName);
        localStorage.setItem('isLoggedIn', 'true');
        return true;
    }

    // ログアウト処理
    logout() {
        localStorage.removeItem('userName');
        localStorage.removeItem('isLoggedIn');
        this.currentUser = null;
        window.location.href = 'index.html';
    }
}

// グローバルなユーザーマネージャーインスタンス
const userManager = new UserManager();

// 共通コンポーネントの読み込み
async function loadComponents() {
    try {
        // ヘッダーの読み込み
        const headerResponse = await fetch('components/header.html');
        if (headerResponse.ok) {
            const headerHTML = await headerResponse.text();
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = headerHTML;
            }
        }

        // フッターの読み込み
        const footerResponse = await fetch('components/footer.html');
        if (footerResponse.ok) {
            const footerHTML = await footerResponse.text();
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = footerHTML;
            }
        }
    } catch (error) {
        console.log('コンポーネントの読み込みに失敗しました:', error);
    }
}

// URLパラメータを取得する関数
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// URLパラメータからユーザー名を取得して表示
function displayUserNameFromURL() {
    const userName = getURLParameter('user');
    const userNameElement = document.getElementById('worksheetUserName');
    
    if (userNameElement) {
        if (userName) {
            userNameElement.textContent = userName;
        } else {
            // URLパラメータがない場合は、保存されたユーザー名を使用
            const savedUserName = userManager.getCurrentUserName();
            userNameElement.textContent = savedUserName;
        }
    }
}

// URLパラメータからユーザー名を取得してタイトルを更新
function updateTitleWithUserName() {
    const userName = getURLParameter('user');
    const titleElement = document.querySelector('.main-title');
    
    if (titleElement) {
        if (userName) {
            titleElement.textContent = `${userName}の冒険記録`;
        } else {
            // URLパラメータがない場合は、保存されたユーザー名を使用
            const savedUserName = userManager.getCurrentUserName();
            if (savedUserName && savedUserName !== '冒険者') {
                titleElement.textContent = `${savedUserName}の冒険記録`;
            } else {
                titleElement.textContent = 'りくの冒険記録';
            }
        }
    }
}
// ログインフォームの初期化
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // 簡単な認証（実際の実装では適切な認証処理を行う）
            if (username && password) {
                userManager.login(username);
                alert('ログインしました！');
                window.location.href = 'dashboard.html';
            } else {
                alert('ユーザー名とパスワードを入力してください。');
            }
        });
    }
}

// 新規登録フォームの初期化
function initSignup() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('パスワードが一致しません。');
                return;
            }
            
            if (username && email && password) {
                userManager.login(username);
                alert('アカウントを作成しました！');
                window.location.href = 'dashboard.html';
            } else {
                alert('すべての項目を入力してください。');
            }
        });
    }
}

// ダッシュボードの初期化
function initDashboard() {
    // ログイン状態をチェック
    if (!userManager.isLoggedIn()) {
        alert('ログインが必要です。');
        window.location.href = 'login.html';
        return;
    }

    // ユーザー名を表示
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = userManager.getCurrentUserName();
    }

    // ワークシートボタンのイベントリスナー
    const worksheetBtn = document.getElementById('worksheetBtn');
    if (worksheetBtn) {
        worksheetBtn.addEventListener('click', function() {
            const userName = userManager.getCurrentUserName();
            window.location.href = `worksheet.html?user=${encodeURIComponent(userName)}`;
        });
    }
}

// ページ読み込み時の共通処理
document.addEventListener('DOMContentLoaded', function() {
    // 現在のページに応じた初期化処理
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'login.html':
            initLogin();
            break;
        case 'signup.html':
            initSignup();
            break;
        case 'dashboard.html':
            initDashboard();
            break;
        case 'worksheet.html':
            updateTitleWithUserName();
            break;
    }
});

// エクスポート（将来的なモジュール化のため）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UserManager,
        userManager,
        loadComponents,
        getURLParameter,
        displayUserNameFromURL
    };
}