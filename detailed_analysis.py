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
            ingredient_normalized = ingredient.strip()
            ingredient_counter[ingredient_normalized] += 1

# 全ての材料を頻度順でソート
all_ingredients = ingredient_counter.most_common()

# 詳細な分析結果をファイルに出力
output_file = Path("C:/Users/osush/OneDrive/ドキュメント/cocktail/detailed_ingredient_analysis.txt")

with open(output_file, 'w', encoding='utf-8') as f:
    f.write("=" * 80 + "\n")
    f.write("カクテル材料の詳細分析結果\n")
    f.write("=" * 80 + "\n")
    f.write(f"総カクテル数: {len(cocktails)}\n")
    f.write(f"ユニークな材料数: {len(ingredient_counter)}\n")
    f.write(f"総材料使用回数: {sum(ingredient_counter.values())}\n")
    f.write("=" * 80 + "\n")
    
    # 改良されたカテゴリ分類
    spirits_keywords = ['ウイスキー', 'ジン', 'ウォッカ', 'ラム', 'テキーラ', 'ブランデー', 'コニャック', 'アルマニャック', 'カシャーサ']
    liqueur_keywords = ['リキュール', 'セック', 'キュラソー', 'シロップ', 'ベルモット', 'アマレット', 'カルーア', 'ティア', 'バイリーズ', 'グラン', 'シャンボール', 'アブサン', 'アペロール']
    soft_drink_keywords = ['ソーダ', 'ウォーター', 'ジュース', 'コーラ', 'ジンジャー', 'トニック', 'ビール', 'ワイン', 'シャンパン', 'プロセッコ', 'エール']
    fruit_keywords = ['レモン', 'ライム', 'オレンジ', 'グレープフルーツ', 'ピーチ', 'アップル', 'チェリー', 'ベリー', 'バナナ', 'パイナップル', 'クランベリー', 'ツイスト', 'ピール', 'ホイール', 'ウェッジ', 'スライス']
    other_keywords = ['卵', '砂糖', '塩', 'ミント', 'バジル', 'ローズマリー', 'タイム', 'シナモン', 'バニラ', 'ココナッツ', 'クリーム', 'ミルク', '蜂蜜', '氷', 'ビターズ']
    
    def categorize_ingredient(ingredient):
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
    
    for ingredient, count in all_ingredients:
        category = categorize_ingredient(ingredient)
        categories[category].append((ingredient, count))
    
    # カテゴリ別結果の表示（頻度順）
    for category, items in categories.items():
        if items:
            f.write(f"\n【{category}】 ({len(items)}種類)\n")
            f.write("-" * 60 + "\n")
            for ingredient, count in items:
                percentage = (count / sum(ingredient_counter.values())) * 100
                f.write(f"  {ingredient:<30} {count:>3}回 ({percentage:.1f}%)\n")
    
    f.write("\n" + "=" * 80 + "\n")
    f.write("カテゴリ別統計サマリー\n")
    f.write("=" * 80 + "\n")
    for category, items in categories.items():
        if items:
            total_count = sum(count for _, count in items)
            percentage = (total_count / sum(ingredient_counter.values())) * 100
            f.write(f"{category:<15}: {len(items):>3}種類, {total_count:>4}回使用 ({percentage:.1f}%)\n")
    
    # 上位使用材料の詳細分析
    f.write("\n" + "=" * 80 + "\n")
    f.write("上位20位の材料とその特徴\n")
    f.write("=" * 80 + "\n")
    
    top_20 = all_ingredients[:20]
    for rank, (ingredient, count) in enumerate(top_20, 1):
        category = categorize_ingredient(ingredient)
        percentage = (count / sum(ingredient_counter.values())) * 100
        f.write(f"{rank:>2}位: {ingredient:<25} {count:>3}回 ({percentage:.1f}%) - {category}\n")
    
    # 使用頻度が低い材料の分析
    f.write("\n" + "=" * 80 + "\n")
    f.write("使用頻度分布\n")
    f.write("=" * 80 + "\n")
    
    frequency_dist = collections.Counter(count for _, count in all_ingredients)
    f.write("使用回数 | 材料数\n")
    f.write("-" * 20 + "\n")
    for freq in sorted(frequency_dist.keys(), reverse=True):
        if freq >= 5:
            f.write(f"{freq:>6}回 | {frequency_dist[freq]:>4}種類\n")
    
    # 1回のみ使用される材料の数
    single_use = sum(1 for _, count in all_ingredients if count == 1)
    f.write(f"\n1回のみ使用: {single_use}種類 ({single_use/len(all_ingredients)*100:.1f}%)\n")
    f.write(f"2回以上使用: {len(all_ingredients) - single_use}種類 ({(len(all_ingredients) - single_use)/len(all_ingredients)*100:.1f}%)\n")

print("詳細分析完了！結果はdetailed_ingredient_analysis.txtファイルに保存されました。")
print(f"ファイル保存先: {output_file}")