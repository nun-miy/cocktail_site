import json
import collections
from pathlib import Path

# JSONファイルを読み込み
file_path = Path("C:/Users/osush/OneDrive/ドキュメント/cocktail/cocktail-recipes.json")

try:
    with open(file_path, 'r', encoding='utf-8') as file:
        cocktails = json.load(file)
except FileNotFoundError:
    print(f"ファイルが見つかりません: {file_path}")
    exit(1)
except json.JSONDecodeError:
    print("JSONファイルの読み取りに失敗しました")
    exit(1)

# 材料を抽出して頻度を数える
ingredient_counter = collections.Counter()

for cocktail in cocktails:
    if 'ingredients' in cocktail:
        for ingredient in cocktail['ingredients']:
            # 材料名を正規化（前後の空白を削除）
            ingredient_normalized = ingredient.strip()
            ingredient_counter[ingredient_normalized] += 1

# 頻度順でソート（上位50位まで）
top_ingredients = ingredient_counter.most_common(50)

# 結果をファイルに出力
output_file = Path("C:/Users/osush/OneDrive/ドキュメント/cocktail/ingredient_analysis.txt")

with open(output_file, 'w', encoding='utf-8') as f:
    f.write("=" * 60 + "\n")
    f.write("カクテル材料の頻度分析結果\n")
    f.write("=" * 60 + "\n")
    f.write(f"総カクテル数: {len(cocktails)}\n")
    f.write(f"ユニークな材料数: {len(ingredient_counter)}\n")
    f.write(f"総材料使用回数: {sum(ingredient_counter.values())}\n")
    f.write("=" * 60 + "\n")
    
    f.write("\n【頻度順 上位50位の材料】\n")
    f.write("-" * 50 + "\n")
    f.write(f"{'順位':<4} {'材料名':<20} {'頻度':<6} {'割合':<8}\n")
    f.write("-" * 50 + "\n")
    
    total_usage = sum(ingredient_counter.values())
    for rank, (ingredient, count) in enumerate(top_ingredients, 1):
        percentage = (count / total_usage) * 100
        f.write(f"{rank:<4} {ingredient:<20} {count:<6} {percentage:.1f}%\n")
    
    f.write("\n" + "=" * 60 + "\n")
    f.write("材料分類のための分析\n")
    f.write("=" * 60 + "\n")
    
    # 材料をカテゴリに分類するための準備
    spirits_keywords = ['ウイスキー', 'ジン', 'ウォッカ', 'ラム', 'テキーラ', 'ブランデー', 'コニャック', 'アルマニャック']
    liqueur_keywords = ['リキュール', 'セック', 'キュラソー', 'シロップ', 'ベルモット', 'アマレット', 'カルーア', 'ティア', 'バイリーズ', 'グラン', 'シャンボール']
    soft_drink_keywords = ['ソーダ', 'ウォーター', 'ジュース', 'コーラ', 'ジンジャー', 'トニック', 'ビール', 'ワイン', 'シャンパン', 'プロセッコ']
    fruit_keywords = ['レモン', 'ライム', 'オレンジ', 'グレープフルーツ', 'ピーチ', 'アップル', 'チェリー', 'ベリー', 'バナナ', 'パイナップル', 'クランベリー']
    other_keywords = ['卵', '砂糖', '塩', 'ミント', 'バジル', 'ローズマリー', 'タイム', 'シナモン', 'バニラ', 'ココナッツ', 'クリーム', 'ミルク']
    
    def categorize_ingredient(ingredient):
        ingredient_lower = ingredient.lower()
        
        # スピリッツの判定
        for keyword in spirits_keywords:
            if keyword in ingredient:
                return 'スピリッツ'
        
        # リキュールの判定
        for keyword in liqueur_keywords:
            if keyword in ingredient:
                return 'リキュール'
        
        # ソフトドリンクの判定
        for keyword in soft_drink_keywords:
            if keyword in ingredient:
                return 'ソフトドリンク'
        
        # フルーツの判定
        for keyword in fruit_keywords:
            if keyword in ingredient:
                return 'フルーツ'
        
        # その他の判定
        for keyword in other_keywords:
            if keyword in ingredient:
                return 'その他'
        
        return '未分類'
    
    # カテゴリ別に分類
    categories = {
        'スピリッツ': [],
        'リキュール': [],
        'ソフトドリンク': [],
        'フルーツ': [],
        'その他': [],
        '未分類': []
    }
    
    for ingredient, count in top_ingredients:
        category = categorize_ingredient(ingredient)
        categories[category].append((ingredient, count))
    
    # カテゴリ別結果の表示
    for category, items in categories.items():
        if items:
            f.write(f"\n【{category}】\n")
            f.write("-" * 40 + "\n")
            for ingredient, count in items:
                f.write(f"  {ingredient:<20} {count:>3}回\n")
    
    f.write("\n" + "=" * 60 + "\n")
    f.write("カテゴリ別統計\n")
    f.write("=" * 60 + "\n")
    for category, items in categories.items():
        if items:
            total_count = sum(count for _, count in items)
            percentage = (total_count / sum(ingredient_counter.values())) * 100
            f.write(f"{category:<12}: {len(items):>3}種類, {total_count:>4}回使用 ({percentage:.1f}%)\n")

print("分析完了！結果はingredient_analysis.txtファイルに保存されました。")
print(f"ファイル保存先: {output_file}")