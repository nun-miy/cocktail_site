const puppeteer = require('puppeteer');

async function runE2ETests() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  try {
    console.log('🚀 E2Eテストを開始します...');
    
    // 1. ページの読み込み確認
    console.log('1. ページの読み込み確認中...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
    
    // ヘッダーの確認
    const headerText = await page.$eval('h1', el => el.textContent);
    console.log(`✓ ヘッダー: ${headerText}`);
    
    // カクテル数の確認
    const cocktailCount = await page.$eval('div:contains("616種のカクテルレシピ")', el => el.textContent);
    console.log(`✓ カクテル数表示: ${cocktailCount}`);
    
    // 2. 初期表示の確認
    console.log('2. 初期表示の確認中...');
    
    // 検索フィルターの存在確認
    const searchInput = await page.$('input[type="search"]');
    console.log(`✓ 検索窓: ${searchInput ? '存在' : '不存在'}`);
    
    // 材料フィルターの存在確認
    const ingredientFilters = await page.$$('div:contains("スピリッツ")');
    console.log(`✓ 材料フィルター: ${ingredientFilters.length > 0 ? '存在' : '不存在'}`);
    
    // カクテルカードの表示確認
    const cocktailCards = await page.$$('[class*="cursor-pointer"]');
    console.log(`✓ カクテルカード数: ${cocktailCards.length}件`);
    
    // 3. 名前検索機能のテスト
    console.log('3. 名前検索機能のテスト中...');
    
    // 検索窓に「モヒート」と入力
    await page.type('input[type="search"]', 'モヒート');
    await page.waitForTimeout(500);
    
    // 結果の確認
    const searchResults = await page.$$('[class*="cursor-pointer"]');
    console.log(`✓ 「モヒート」検索結果: ${searchResults.length}件`);
    
    // 検索結果にモヒートが含まれているか確認
    const mohitoCard = await page.$('h3:contains("モヒート")');
    console.log(`✓ モヒートカード: ${mohitoCard ? '発見' : '未発見'}`);
    
    // 検索をクリア
    await page.click('input[type="search"]');
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    await page.waitForTimeout(500);
    
    // 4. 材料検索機能のテスト
    console.log('4. 材料検索機能のテスト中...');
    
    // スピリッツセクションを展開
    const spiritsSection = await page.$('h3:contains("スピリッツ")');
    if (spiritsSection) {
      // ジンのチェックボックスを探してクリック
      const ginCheckbox = await page.$('input[type="checkbox"][id*="ジン"]');
      if (ginCheckbox) {
        await ginCheckbox.click();
        await page.waitForTimeout(500);
        
        const filteredResults = await page.$$('[class*="cursor-pointer"]');
        console.log(`✓ ジン選択後の結果: ${filteredResults.length}件`);
      }
    }
    
    // 5. ページネーション機能のテスト
    console.log('5. ページネーション機能のテスト中...');
    
    // フィルターをクリア
    const clearButton = await page.$('button:contains("フィルターをクリア")');
    if (clearButton) {
      await clearButton.click();
      await page.waitForTimeout(500);
    }
    
    // ページネーションボタンの確認
    const paginationButtons = await page.$$('button:contains("次へ")');
    console.log(`✓ ページネーションボタン: ${paginationButtons.length > 0 ? '存在' : '不存在'}`);
    
    if (paginationButtons.length > 0) {
      await paginationButtons[0].click();
      await page.waitForTimeout(500);
      console.log('✓ 2ページ目に移動完了');
    }
    
    // 6. カクテル詳細表示のテスト
    console.log('6. カクテル詳細表示のテスト中...');
    
    // 最初のカクテルカードをクリック
    const firstCard = await page.$('[class*="cursor-pointer"]');
    if (firstCard) {
      await firstCard.click();
      await page.waitForTimeout(500);
      
      // モーダルが表示されるか確認
      const modal = await page.$('div[class*="fixed inset-0"]');
      console.log(`✓ 詳細モーダル: ${modal ? '表示' : '非表示'}`);
      
      if (modal) {
        // モーダルの内容確認
        const modalTitle = await page.$eval('h2', el => el.textContent);
        console.log(`✓ モーダルタイトル: ${modalTitle}`);
        
        // 閉じるボタンをクリック
        const closeButton = await page.$('button:contains("✕")');
        if (closeButton) {
          await closeButton.click();
          await page.waitForTimeout(500);
          console.log('✓ モーダルを閉じました');
        }
      }
    }
    
    // 7. レスポンシブデザインの確認
    console.log('7. レスポンシブデザインの確認中...');
    
    // モバイルサイズに変更
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileCards = await page.$$('[class*="cursor-pointer"]');
    console.log(`✓ モバイル表示でのカード数: ${mobileCards.length}件`);
    
    // タブレットサイズに変更
    await page.setViewport({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    const tabletCards = await page.$$('[class*="cursor-pointer"]');
    console.log(`✓ タブレット表示でのカード数: ${tabletCards.length}件`);
    
    console.log('🎉 E2Eテストが完了しました！');
    
  } catch (error) {
    console.error('❌ テスト中にエラーが発生しました:', error);
  } finally {
    await browser.close();
  }
}

// テストのインポート用
if (require.main === module) {
  runE2ETests().catch(console.error);
}

module.exports = runE2ETests;