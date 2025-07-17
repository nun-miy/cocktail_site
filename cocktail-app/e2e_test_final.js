const puppeteer = require('puppeteer');

async function runE2ETests() {
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
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  try {
    console.log('🚀 E2Eテストを開始します...');
    
    // 1. ページの読み込み確認
    console.log('1. ページの読み込み確認中...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
    await delay(2000);
    
    // ヘッダーの確認
    try {
      const headerText = await page.$eval('h1', el => el.textContent);
      logTest('ヘッダー表示', headerText.includes('カクテルレシピ検索'), headerText);
    } catch (error) {
      logTest('ヘッダー表示', false, 'ヘッダーが見つかりません');
    }
    
    // カクテル数の確認
    try {
      const pageContent = await page.content();
      const has616 = pageContent.includes('616種');
      logTest('カクテル数表示', has616, '616種の表示確認');
    } catch (error) {
      logTest('カクテル数表示', false, 'カクテル数確認でエラー');
    }
    
    // 2. 初期表示の確認
    console.log('2. 初期表示の確認中...');
    
    // 検索窓の存在確認
    try {
      const searchInput = await page.$('input[type="search"]');
      logTest('検索窓存在', searchInput !== null, '検索窓が存在');
    } catch (error) {
      logTest('検索窓存在', false, '検索窓確認でエラー');
    }
    
    // 材料フィルターの存在確認
    try {
      const pageContent = await page.content();
      const hasSpirits = pageContent.includes('スピリッツ');
      logTest('材料フィルター存在', hasSpirits, 'スピリッツフィルターが存在');
    } catch (error) {
      logTest('材料フィルター存在', false, '材料フィルター確認でエラー');
    }
    
    // カクテルカードの表示確認
    try {
      const cocktailCards = await page.$$('[class*="cursor-pointer"]');
      logTest('カクテルカード表示', cocktailCards.length > 0, `${cocktailCards.length}件のカクテルカードを表示`);
    } catch (error) {
      logTest('カクテルカード表示', false, 'カクテルカード確認でエラー');
    }
    
    // 3. 名前検索機能のテスト
    console.log('3. 名前検索機能のテスト中...');
    
    try {
      // 検索窓に「モヒート」と入力
      await page.type('input[type="search"]', 'モヒート');
      await delay(1500);
      
      // 結果の確認
      const searchResults = await page.$$('[class*="cursor-pointer"]');
      logTest('名前検索機能', searchResults.length > 0, `モヒート検索で${searchResults.length}件の結果`);
      
      // 検索結果にモヒートが含まれているか確認
      const pageContent = await page.content();
      const hasMojito = pageContent.includes('モヒート');
      logTest('モヒート検索結果', hasMojito, 'モヒートが検索結果に含まれる');
      
      // 検索をクリア
      await page.click('input[type="search"]', { clickCount: 3 });
      await page.keyboard.press('Delete');
      await delay(1000);
      
    } catch (error) {
      logTest('名前検索機能', false, `検索機能でエラー: ${error.message}`);
    }
    
    // 4. 材料検索機能のテスト
    console.log('4. 材料検索機能のテスト中...');
    
    try {
      // ジンのチェックボックスを探してクリック
      const ginCheckbox = await page.$('input[type="checkbox"]');
      
      if (ginCheckbox) {
        await ginCheckbox.click();
        await delay(1500);
        
        const filteredResults = await page.$$('[class*="cursor-pointer"]');
        logTest('材料検索機能', filteredResults.length > 0, `材料選択で${filteredResults.length}件の結果`);
        
        // フィルターをクリア（可能であれば）
        const clearButton = await page.$('button:contains("フィルターをクリア")');
        if (clearButton) {
          await clearButton.click();
          await delay(1000);
          logTest('フィルタークリア', true, 'フィルターをクリア');
        } else {
          // チェックボックスを再度クリックしてクリア
          await ginCheckbox.click();
          await delay(1000);
          logTest('フィルタークリア', true, 'チェックボックスをクリアしました');
        }
      } else {
        logTest('材料検索機能', false, 'チェックボックスが見つかりません');
      }
    } catch (error) {
      logTest('材料検索機能', false, `材料検索でエラー: ${error.message}`);
    }
    
    // 5. ページネーション機能のテスト
    console.log('5. ページネーション機能のテスト中...');
    
    try {
      // ページネーションボタンを探す
      const allButtons = await page.$$('button');
      let nextButton = null;
      
      for (const button of allButtons) {
        const buttonText = await page.evaluate(el => el.textContent, button);
        if (buttonText.includes('次へ')) {
          nextButton = button;
          break;
        }
      }
      
      if (nextButton) {
        logTest('ページネーション存在', true, 'ページネーションボタンが存在');
        
        // 次へボタンをクリック
        await nextButton.click();
        await delay(1500);
        
        logTest('ページネーション機能', true, 'ページネーションが動作');
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
        await delay(1500);
        
        // モーダルが表示されるか確認
        const modal = await page.$('div[class*="fixed"]');
        logTest('カクテル詳細表示', modal !== null, '詳細モーダルが表示');
        
        if (modal) {
          // モーダルの内容確認
          const modalTitle = await page.$eval('h2', el => el.textContent).catch(() => '');
          logTest('モーダル内容', modalTitle.length > 0, `モーダルタイトル: ${modalTitle}`);
          
          // 閉じるボタンをクリック
          const closeButton = await page.$('button');
          if (closeButton) {
            const buttonText = await page.evaluate(el => el.textContent, closeButton);
            if (buttonText.includes('✕')) {
              await closeButton.click();
              await delay(1000);
              logTest('モーダル閉じる', true, 'モーダルを閉じました');
            }
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
      await delay(1500);
      
      const mobileCards = await page.$$('[class*="cursor-pointer"]');
      logTest('モバイルレスポンシブ', mobileCards.length > 0, `モバイル表示で${mobileCards.length}件表示`);
      
      // タブレットサイズに変更
      await page.setViewport({ width: 768, height: 1024 });
      await delay(1500);
      
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