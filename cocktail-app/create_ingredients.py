import json
from collections import Counter

# カクテルデータを読み込み
with open('src/data/cocktails.json', 'r', encoding='utf-8') as f:
    cocktails = json.load(f)

# 全ての材料を抽出
all_ingredients = []
for cocktail in cocktails:
    all_ingredients.extend(cocktail['ingredients'])

# 材料の頻度を計算
ingredient_counts = Counter(all_ingredients)

# 材料を分類
spirits = [
    'ジン', 'ウォッカ', 'テキーラ', 'ホワイトラム', 'ブランデー', 'ウイスキー', 'ラム', 'ダークラム',
    'バーボンウイスキー', 'コニャック', 'ライウイスキー', 'スコッチウイスキー', 'アイリッシュウイスキー',
    'カシャーサ', 'ピスコ', 'アブサン', 'アクアビット', 'メスカル', 'グラッパ', 'マール',
    'ジン 60ml', 'ウォッカ 45ml', 'テキーラ 45ml', 'ホワイトラム 45ml', 'ブランデー 45ml'
]

liqueurs = [
    'グレナデンシロップ', 'スイートベルモット', 'ドライベルモット', 'トリプルセック', 'アマレット',
    'カルーア', 'コアントロー', 'ベイリーズ', 'グランマルニエ', 'チャンボール', 'ディサローノ',
    'ガリアーノ', 'ヨーグルトリキュール', 'ピーチシナップス', 'ブルーキュラソー', 'カンパリ',
    'アペロール', 'サンブーカ', 'ベネディクティン', 'ドランブイエ', 'マラスキーノ', 'ミドリ',
    'パッソア', 'ティアマリア', 'フランジェリコ', 'ヒプノティック', 'モンテネグロ', 'アヴェルナ',
    'ジェーガーマイスター', 'ペルノー', 'シャルトリューズ', 'ストレガ', 'ドン・フリオ',
    'ロックンロール', 'ハニーウイスキー', 'バイオレットリキュール', 'エルダーフラワーリキュール',
    'ローズリキュール', 'ラヴェンダーリキュール', 'バニラリキュール', 'シナモンリキュール',
    'ジンジャーリキュール', 'ココナッツリキュール', 'パイナップルリキュール', 'バナナリキュール',
    'ストロベリーリキュール', 'ラズベリーリキュール', 'ブラックベリーリキュール', 'チェリーリキュール'
]

soft_drinks = [
    'ライムジュース', 'レモンジュース', 'ソーダ水', 'シャンパン', 'オレンジジュース', 'パイナップルジュース',
    'クランベリージュース', 'プロセッコ', 'グレープフルーツジュース', 'トニックウォーター', 'ジンジャーエール',
    'コーラ', 'ジンジャービール', 'トマトジュース', 'アップルジュース', 'ピーチジュース', 'マンゴージュース',
    'ココナッツウォーター', 'エナジードリンク', 'セルツァー', 'ミネラルウォーター', 'アイスティー',
    'コーヒー', 'エスプレッソ', 'ホットチョコレート', 'ミルク', 'ハーフアンドハーフ', 'ヘビークリーム',
    'レモンジュース 25ml', 'レモンジュース 15ml', 'ライムジュース 15ml', 'オレンジジュース 30ml'
]

fruits = [
    'オレンジツイスト', 'レモンツイスト', 'マラスキーノチェリー', 'ライムホイール', 'オレンジピール',
    'ライムウェッジ', 'レモンウェッジ', 'オレンジウェッジ', 'レモンスライス', 'ライムスライス',
    'オレンジスライス', 'チェリー', 'オリーブ', 'ピックルオニオン', 'セロリ', 'キューカンバー',
    'ストロベリー', 'ブルーベリー', 'ラズベリー', 'ブラックベリー', 'ピーチ', 'アプリコット',
    'プラム', 'グレープ', 'パイナップル', 'ココナッツ', 'バナナ', 'キウイ', 'マンゴー',
    'パッションフルーツ', 'ライチ', 'ドラゴンフルーツ', 'スターフルーツ', 'フィグ', 'デーツ'
]

others = [
    '砂糖', 'ミント', '卵白', '生クリーム', '塩', '蜂蜜', 'シナモン', '卵白 1個', 'ココナッツクリーム',
    'アンゴスチュラビターズ', 'オレンジビターズ', 'ペイショーズビターズ', 'ウォルナットビターズ',
    'チョコレートビターズ', 'ラベンダービターズ', 'ローズマリー', 'タイム', 'バジル', 'セージ',
    'オレガノ', 'コリアンダー', 'カルダモン', 'ナツメグ', 'クローブ', 'オールスパイス',
    'ブラックペッパー', 'ホワイトペッパー', 'カイエンペッパー', 'パプリカ', 'ターメリック',
    'バニラエッセンス', 'アーモンドエッセンス', 'ローズウォーター', 'オレンジブロッサムウォーター',
    'アガベシロップ', 'メープルシロップ', 'ブラウンシュガー', 'ブラウンシュガーシロップ',
    'シンプルシロップ', 'シンプルシロップ 15ml', 'シュガーシロップ', 'リッチシンプルシロップ',
    'デメララシロップ', 'ハニーシロップ', 'ジンジャーシロップ', 'バニラシロップ', 'シナモンシロップ',
    'ミントシロップ', 'ラベンダーシロップ', 'ローズシロップ', 'エルダーフラワーシロップ',
    'パッションフルーツシロップ', 'ココナッツシロップ'
]

# 実際に使用されている材料のみを各カテゴリに含める
def get_used_ingredients(category_ingredients):
    used = []
    for ingredient in category_ingredients:
        if ingredient in ingredient_counts:
            used.append(ingredient)
    # 使用頻度順でソート
    used.sort(key=lambda x: ingredient_counts[x], reverse=True)
    return used

# 各カテゴリで実際に使用されている材料を抽出
categorized_ingredients = {
    'spirits': get_used_ingredients(spirits),
    'liqueurs': get_used_ingredients(liqueurs),
    'soft_drinks': get_used_ingredients(soft_drinks),
    'fruits': get_used_ingredients(fruits),
    'others': get_used_ingredients(others)
}

# 未分類の材料を見つける
categorized_all = set()
for ingredients in categorized_ingredients.values():
    categorized_all.update(ingredients)

uncategorized = []
for ingredient in ingredient_counts:
    if ingredient not in categorized_all:
        uncategorized.append(ingredient)

uncategorized.sort(key=lambda x: ingredient_counts[x], reverse=True)

# 未分類の材料を手動で適切なカテゴリに追加
print("未分類の材料（頻度順）:")
for ingredient in uncategorized[:50]:  # 上位50個を表示
    print(f"{ingredient}: {ingredient_counts[ingredient]}回")

# ingredients.jsonファイルを作成
with open('src/data/ingredients.json', 'w', encoding='utf-8') as f:
    json.dump(categorized_ingredients, f, ensure_ascii=False, indent=2)

print(f"\n材料分類完了:")
print(f"スピリッツ: {len(categorized_ingredients['spirits'])}種類")
print(f"リキュール: {len(categorized_ingredients['liqueurs'])}種類")
print(f"ソフトドリンク: {len(categorized_ingredients['soft_drinks'])}種類")
print(f"フルーツ: {len(categorized_ingredients['fruits'])}種類")
print(f"その他: {len(categorized_ingredients['others'])}種類")
print(f"未分類: {len(uncategorized)}種類")