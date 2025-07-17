const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runUITest() {
  console.log('🚀 UI確認とE2Eテストを開始します...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: [],
    screenshots: []
  };
  
  function logTest(testName, success, message) {
    testResults.total++;
    if (success) {
      testResults.passed++;
      testResults.details.push(`✅ ${testName}: ${message}`);
      console.log(`✅ ${testName}: ${message}`);
    } else {
      testResults.failed++;
      testResults.details.push(`❌ ${testName}: ${message}`);
      console.log(`❌ ${testName}: ${message}`);
    }
  }
  
  async function takeScreenshot(name, description) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshot_${name}_${timestamp}.png`;
    const screenshotPath = path.join(__dirname, 'screenshots', filename);
    
    // スクリーンショット用ディレクトリを作成
    const screenshotDir = path.dirname(screenshotPath);
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    await page.screenshot({ path: screenshotPath, fullPage: true });
    testResults.screenshots.push({
      name: description,
      path: screenshotPath,
      filename
    });
    console.log(`📸 スクリーンショット保存: ${filename} - ${description}`);
    return screenshotPath;
  }
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  try {
    // 1. ページの読み込み確認
    console.log('1. ページの読み込み確認中...');
    await page.goto('http://localhost:5177', { waitUntil: 'networkidle2' });
    await delay(2000);
    
    // 初期画面のスクリーンショット
    await takeScreenshot('01_initial', '初期画面表示');
    
    // ヘッダーの確認
    try {
      const headerText = await page.$eval('h1', el => el.textContent);
      logTest('ヘッダー表示', headerText.includes('カクテルレシピ検索'), headerText);
    } catch (error) {
      logTest('ヘッダー表示', false, 'ヘッダーが見つかりません');
    }
    
    // 2列タイル表示の確認
    try {
      const cocktailCards = await page.$$('[class*="grid-cols-2"]');
      logTest('2列タイル表示', cocktailCards.length > 0, '2列グリッドレイアウトを確認');
    } catch (error) {
      logTest('2列タイル表示', false, '2列表示が見つかりません');
    }
    
    // カクテルカードの表示確認
    try {
      const cocktailCards = await page.$$('[class*="cursor-pointer"]');
      logTest('カクテルカード表示', cocktailCards.length > 0, `${cocktailCards.length}件のカクテルカードを表示`);
      
      // カードのスクリーンショット
      await takeScreenshot('02_cards', 'カクテルカード2列表示');
    } catch (error) {
      logTest('カクテルカード表示', false, 'カクテルカードが見つかりません');
    }
    
    // 2. フィルターボタンの確認
    console.log('2. フィルターボタンの確認中...');
    
    try {
      // フィルターボタンを探す
      const filterButton = await page.$('button:has-text("フィルター")') || 
                          await page.$('button[class*="flex items-center space-x-2"]');
      
      if (filterButton) {
        logTest('フィルターボタン存在', true, 'フィルターボタンが存在');
        
        // フィルターボタンをクリック
        await filterButton.click();
        await delay(1000);
        
        // サイドメニューが表示されるか確認
        const sideMenu = await page.$('div[class*="fixed top-0 left-0"]');
        logTest('サイドメニュー表示', sideMenu !== null, 'サイドメニューが表示');
        
        if (sideMenu) {
          await takeScreenshot('03_filter_menu', 'フィルターメニュー表示');
          
          // メニューを閉じる
          const overlay = await page.$('div[class*="bg-black/50"]');
          if (overlay) {
            await overlay.click();
            await delay(500);
          }
        }
      } else {
        logTest('フィルターボタン存在', false, 'フィルターボタンが見つかりません');
      }
    } catch (error) {
      logTest('フィルターボタン確認', false, `フィルターボタン確認でエラー: ${error.message}`);
    }
    
    // 3. 検索機能のテスト
    console.log('3. 検索機能のテスト中...');
    
    try {
      // 検索窓に「モヒート」と入力
      const searchInput = await page.$('input[type="search"]');
      if (searchInput) {
        await searchInput.type('モヒート');
        await delay(1500);
        
        // 結果のスクリーンショット
        await takeScreenshot('04_search_result', 'モヒート検索結果');
        
        const searchResults = await page.$$('[class*="cursor-pointer"]');
        logTest('名前検索機能', searchResults.length > 0, `モヒート検索で${searchResults.length}件の結果`);
        
        // 検索をクリア
        await searchInput.click({ clickCount: 3 });
        await page.keyboard.press('Delete');
        await delay(1000);
      } else {
        logTest('名前検索機能', false, '検索窓が見つかりません');
      }
    } catch (error) {
      logTest('名前検索機能', false, `検索機能でエラー: ${error.message}`);
    }
    
    // 4. カクテル詳細表示のテスト
    console.log('4. カクテル詳細表示のテスト中...');
    
    try {
      // 最初のカクテルカードをクリック
      const firstCard = await page.$('[class*="cursor-pointer"]');
      if (firstCard) {
        await firstCard.click();
        await delay(1500);
        
        // モーダルが表示されるか確認
        const modal = await page.$('div[class*="fixed inset-0"]');
        logTest('カクテル詳細表示', modal !== null, '詳細モーダルが表示');
        
        if (modal) {
          await takeScreenshot('05_detail_modal', 'カクテル詳細モーダル');
          
          // 閉じるボタンをクリック
          const closeButton = await page.$('button:has-text("閉じる")') ||
                             await page.$('button:has-text("✕")');
          if (closeButton) {
            await closeButton.click();
            await delay(1000);
            logTest('モーダル閉じる', true, 'モーダルを閉じました');
          }
        }
      } else {
        logTest('カクテル詳細表示', false, 'カクテルカードが見つかりません');
      }
    } catch (error) {
      logTest('カクテル詳細表示', false, `詳細表示でエラー: ${error.message}`);
    }
    
    // 5. レスポンシブデザインの確認
    console.log('5. レスポンシブデザインの確認中...');
    
    try {
      // モバイルサイズに変更
      await page.setViewport({ width: 375, height: 667 });
      await delay(1500);
      
      await takeScreenshot('06_mobile', 'モバイル表示');
      
      const mobileCards = await page.$$('[class*="cursor-pointer"]');
      logTest('モバイルレスポンシブ', mobileCards.length > 0, `モバイル表示で${mobileCards.length}件表示`);
      
      // タブレットサイズに変更
      await page.setViewport({ width: 768, height: 1024 });
      await delay(1500);
      
      await takeScreenshot('07_tablet', 'タブレット表示');
      
      const tabletCards = await page.$$('[class*="cursor-pointer"]');
      logTest('タブレットレスポンシブ', tabletCards.length > 0, `タブレット表示で${tabletCards.length}件表示`);
      
      // デスクトップサイズに戻す
      await page.setViewport({ width: 1280, height: 720 });
      await delay(1000);
      
      await takeScreenshot('08_final', '最終確認画面');
      
    } catch (error) {
      logTest('レスポンシブデザイン', false, `レスポンシブテストでエラー: ${error.message}`);
    }
    
    // 結果サマリー
    console.log('\n🎯 UI確認・E2Eテスト結果サマリー:');
    console.log(`✅ 成功: ${testResults.passed}/${testResults.total} テスト`);
    console.log(`❌ 失敗: ${testResults.failed}/${testResults.total} テスト`);
    console.log(`📊 成功率: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    console.log(`📸 スクリーンショット: ${testResults.screenshots.length}枚保存`);
    
    return testResults;
    
  } catch (error) {
    console.error('❌ テスト中に致命的なエラーが発生しました:', error);
    testResults.details.push(`❌ 致命的エラー: ${error.message}`);
    return testResults;
  } finally {
    await browser.close();
  }
}

// テストの実行
if (require.main === module) {
  runUITest().then(results => {
    console.log('\n📋 詳細テスト結果:');
    results.details.forEach(detail => console.log(detail));
    
    console.log('\n📸 保存されたスクリーンショット:');
    results.screenshots.forEach(screenshot => {
      console.log(`- ${screenshot.name}: ${screenshot.filename}`);
    });
    
    if (results.failed === 0) {
      console.log('\n🎉 すべてのテストが成功しました！');
    } else {
      console.log('\n⚠️  いくつかのテストが失敗しました。上記の詳細を確認してください。');
    }
  }).catch(console.error);
}

module.exports = runUITest;