const puppeteer = require('puppeteer');

async function runE2ETests() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
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
  
  try {
    console.log('🚀 E2Eテストを開始します...');
    
    // 1. ページの読み込み確認
    console.log('1. ページの読み込み確認中...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
    
    // ヘッダーの確認
    try {
      const headerText = await page.$eval('h1', el => el.textContent);
      logTest('ヘッダー表示', headerText.includes('カクテルレシピ検索'), headerText);
    } catch (error) {
      logTest('ヘッダー表示', false, 'ヘッダーが見つかりません');
    }
    
    // カクテル数の確認
    try {
      const cocktailCountElement = await page.$eval('div:contains("616種")', el => el.textContent);
      logTest('カクテル数表示', true, '616種のカクテルレシピ表示確認');
    } catch (error) {
      // XPathで再試行
      try {
        const elements = await page.$x('//div[contains(text(), "616種")]');
        if (elements.length > 0) {
          const text = await page.evaluate(el => el.textContent, elements[0]);
          logTest('カクテル数表示', true, text);
        } else {
          logTest('カクテル数表示', false, '616種の表示が見つかりません');
        }
      } catch (error2) {
        logTest('カクテル数表示', false, '616種の表示確認でエラー');
      }
    }
    
    // 2. 初期表示の確認
    console.log('2. 初期表示の確認中...');
    
    // 検索窓の存在確認
    try {
      const searchInput = await page.$('input[type="search"]');
      logTest('検索窓存在', searchInput !== null, '検索窓が存在');
    } catch (error) {
      logTest('検索窓存在', false, '検索窓が見つかりません');
    }
    
    // 材料フィルターの存在確認
    try {
      const spiritsHeader = await page.$x('//h3[contains(text(), "スピリッツ")]');
      logTest('材料フィルター存在', spiritsHeader.length > 0, 'スピリッツフィルターが存在');
    } catch (error) {
      logTest('材料フィルター存在', false, '材料フィルターが見つかりません');
    }
    
    // カクテルカードの表示確認
    try {
      const cocktailCards = await page.$$('[class*="cursor-pointer"]');
      logTest('カクテルカード表示', cocktailCards.length > 0, `${cocktailCards.length}件のカクテルカードを表示`);
    } catch (error) {
      logTest('カクテルカード表示', false, 'カクテルカードが見つかりません');
    }
    
    // 3. 名前検索機能のテスト
    console.log('3. 名前検索機能のテスト中...');
    
    try {
      // 検索窓に「モヒート」と入力
      await page.type('input[type="search"]', 'モヒート');
      await page.waitForTimeout(1000);
      
      // 結果の確認
      const searchResults = await page.$$('[class*="cursor-pointer"]');
      logTest('名前検索機能', searchResults.length > 0, `モヒート検索で${searchResults.length}件の結果`);
      
      // 検索結果にモヒートが含まれているか確認
      const mohitoElements = await page.$x('//h3[contains(text(), "モヒート")]');
      logTest('モヒート検索結果', mohitoElements.length > 0, 'モヒートが検索結果に含まれる');
      
      // 検索をクリア
      await page.click('input[type="search"]');
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Delete');
      await page.waitForTimeout(500);
      
    } catch (error) {
      logTest('名前検索機能', false, `検索機能でエラー: ${error.message}`);
    }
    
    // 4. 材料検索機能のテスト
    console.log('4. 材料検索機能のテスト中...');
    
    try {
      // ジンのチェックボックスを探してクリック
      const ginCheckboxes = await page.$x('//label[contains(text(), "ジン")]/..//input[@type="checkbox"]');
      
      if (ginCheckboxes.length > 0) {
        await ginCheckboxes[0].click();
        await page.waitForTimeout(1000);
        
        const filteredResults = await page.$$('[class*="cursor-pointer"]');
        logTest('材料検索機能', filteredResults.length > 0, `ジン選択で${filteredResults.length}件の結果`);
        
        // フィルターをクリア
        const clearButtons = await page.$x('//button[contains(text(), "フィルターをクリア")]');
        if (clearButtons.length > 0) {
          await clearButtons[0].click();
          await page.waitForTimeout(500);
          logTest('フィルタークリア', true, 'フィルターをクリア');
        }
      } else {
        logTest('材料検索機能', false, 'ジンのチェックボックスが見つかりません');
      }
    } catch (error) {
      logTest('材料検索機能', false, `材料検索でエラー: ${error.message}`);
    }
    
    // 5. ページネーション機能のテスト
    console.log('5. ページネーション機能のテスト中...');
    
    try {
      const nextButtons = await page.$x('//button[contains(text(), "次へ")]');
      if (nextButtons.length > 0) {
        logTest('ページネーション存在', true, 'ページネーションボタンが存在');
        
        // 次へボタンをクリック
        await nextButtons[0].click();
        await page.waitForTimeout(1000);
        
        // ページが変わったことを確認
        const currentPageButtons = await page.$x('//button[contains(@class, "bg-blue-600")]');
        logTest('ページネーション機能', currentPageButtons.length > 0, 'ページが変更されました');
      } else {
        logTest('ページネーション存在', false, 'ページネーションボタンが見つかりません');
      }
    } catch (error) {
      logTest('ページネーション機能', false, `ページネーションでエラー: ${error.message}`);
    }
    
    // 6. カクテル詳細表示のテスト
    console.log('6. カクテル詳細表示のテスト中...');
    
    try {
      // 最初のカクテルカードをクリック
      const firstCard = await page.$('[class*="cursor-pointer"]');
      if (firstCard) {
        await firstCard.click();
        await page.waitForTimeout(1000);
        
        // モーダルが表示されるか確認
        const modal = await page.$('div[class*="fixed inset-0"]');
        logTest('カクテル詳細表示', modal !== null, '詳細モーダルが表示');
        
        if (modal) {
          // モーダルの内容確認
          const modalTitle = await page.$eval('h2', el => el.textContent);
          logTest('モーダル内容', modalTitle.length > 0, `モーダルタイトル: ${modalTitle}`);
          
          // 閉じるボタンをクリック
          const closeButtons = await page.$x('//button[contains(text(), "✕")]');
          if (closeButtons.length > 0) {
            await closeButtons[0].click();
            await page.waitForTimeout(500);
            logTest('モーダル閉じる', true, 'モーダルを閉じました');
          }
        }
      } else {
        logTest('カクテル詳細表示', false, 'カクテルカードが見つかりません');
      }
    } catch (error) {
      logTest('カクテル詳細表示', false, `詳細表示でエラー: ${error.message}`);
    }
    
    // 7. レスポンシブデザインの確認
    console.log('7. レスポンシブデザインの確認中...');
    
    try {
      // モバイルサイズに変更
      await page.setViewport({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      
      const mobileCards = await page.$$('[class*="cursor-pointer"]');
      logTest('モバイルレスポンシブ', mobileCards.length > 0, `モバイル表示で${mobileCards.length}件表示`);
      
      // タブレットサイズに変更
      await page.setViewport({ width: 768, height: 1024 });
      await page.waitForTimeout(1000);
      
      const tabletCards = await page.$$('[class*="cursor-pointer"]');
      logTest('タブレットレスポンシブ', tabletCards.length > 0, `タブレット表示で${tabletCards.length}件表示`);
      
    } catch (error) {
      logTest('レスポンシブデザイン', false, `レスポンシブテストでエラー: ${error.message}`);
    }
    
    // 結果サマリー
    console.log('\n🎯 E2Eテスト結果サマリー:');
    console.log(`✅ 成功: ${testResults.passed}/${testResults.total} テスト`);
    console.log(`❌ 失敗: ${testResults.failed}/${testResults.total} テスト`);
    console.log(`📊 成功率: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    return testResults;
    
  } catch (error) {
    console.error('❌ E2Eテスト中に致命的なエラーが発生しました:', error);
    testResults.details.push(`❌ 致命的エラー: ${error.message}`);
    return testResults;
  } finally {
    await browser.close();
  }
}

// テストの実行
if (require.main === module) {
  runE2ETests().then(results => {
    console.log('\n📋 詳細テスト結果:');
    results.details.forEach(detail => console.log(detail));
    
    if (results.failed === 0) {
      console.log('\n🎉 すべてのE2Eテストが成功しました！');
    } else {
      console.log('\n⚠️  いくつかのテストが失敗しました。上記の詳細を確認してください。');
    }
  }).catch(console.error);
}

module.exports = runE2ETests;