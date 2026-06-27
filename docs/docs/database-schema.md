# Database Schema 設計書

## 目的

Coffee Timer のデータ構造を明確にする。

今後、IndexedDB や Supabase を使うときに、同じ設計で開発できるようにする。

---

# データベース名

```text
CoffeeTimerDB
```

---

# 使用するストア

IndexedDB では以下の objectStore を使用する。

```text
brewMenus
beans
settings
brewLogs
```

---

# 1. brewMenus

抽出メニューを保存する。

## 用途

蒸らし、2投目、3投目などの工程をまとめて保存する。

## フィールド

| フィールド名     | 型       | 必須 | 説明    |
| ---------- | ------- | -- | ----- |
| id         | string  | 必須 | 一意のID |
| name       | string  | 必須 | メニュー名 |
| steps      | array   | 必須 | 工程一覧  |
| createdAt  | string  | 必須 | 作成日時  |
| updatedAt  | string  | 必須 | 更新日時  |
| isFavorite | boolean | 任意 | お気に入り |

## steps の構造

| フィールド名  | 型      | 必須 | 説明  |
| ------- | ------ | -- | --- |
| name    | string | 必須 | 工程名 |
| minutes | number | 必須 | 分   |
| seconds | number | 必須 | 秒   |
| order   | number | 必須 | 表示順 |

## 例

```json
{
  "id": "menu_001",
  "name": "メニュー1",
  "steps": [
    {
      "name": "蒸らし",
      "minutes": 1,
      "seconds": 0,
      "order": 1
    },
    {
      "name": "2投目",
      "minutes": 0,
      "seconds": 30,
      "order": 2
    }
  ],
  "createdAt": "2026-06-28T10:00:00.000Z",
  "updatedAt": "2026-06-28T10:00:00.000Z",
  "isFavorite": false
}
```

---

# 2. beans

コーヒー豆メモを保存する。

## 用途

購入した豆、味の評価、感想などを保存する。

## フィールド

| フィールド名       | 型       | 必須 | 説明        |
| ------------ | ------- | -- | --------- |
| id           | string  | 必須 | 一意のID     |
| name         | string  | 必須 | 豆の名前      |
| roaster      | string  | 任意 | ロースター、購入店 |
| origin       | string  | 任意 | 産地        |
| process      | string  | 任意 | 精製方法      |
| roastLevel   | string  | 任意 | 焙煎度       |
| purchaseDate | string  | 任意 | 購入日       |
| openedDate   | string  | 任意 | 開封日       |
| price        | number  | 任意 | 購入価格      |
| weightGram   | number  | 任意 | 内容量g      |
| ratings      | object  | 任意 | 味の評価      |
| flavorNotes  | array   | 任意 | フレーバーノート  |
| memo         | string  | 任意 | 感想メモ      |
| nextTry      | string  | 任意 | 次回試したいこと  |
| repeatRating | number  | 任意 | リピート評価    |
| isFavorite   | boolean | 任意 | お気に入り     |
| createdAt    | string  | 必須 | 作成日時      |
| updatedAt    | string  | 必須 | 更新日時      |

## ratings の構造

1〜5 の数値で保存する。

| フィールド名       | 型      | 説明    |
| ------------ | ------ | ----- |
| acidity      | number | 酸味    |
| bitterness   | number | 苦味    |
| sweetness    | number | 甘み    |
| body         | number | コク    |
| aroma        | number | 香り    |
| aftertaste   | number | 後味    |
| drinkability | number | 飲みやすさ |
| overall      | number | 総合評価  |

## 例

```json
{
  "id": "bean_001",
  "name": "エチオピア イルガチェフェ",
  "roaster": "○○ Coffee",
  "origin": "エチオピア",
  "process": "ウォッシュド",
  "roastLevel": "浅煎り",
  "purchaseDate": "2026-06-28",
  "openedDate": "2026-06-29",
  "price": 1600,
  "weightGram": 200,
  "ratings": {
    "acidity": 4,
    "bitterness": 2,
    "sweetness": 4,
    "body": 3,
    "aroma": 5,
    "aftertaste": 4,
    "drinkability": 5,
    "overall": 5
  },
  "flavorNotes": ["柑橘", "花", "紅茶"],
  "memo": "冷めると柑橘感が強く出る。",
  "nextTry": "次回は湯温を88℃に下げる。",
  "repeatRating": 5,
  "isFavorite": true,
  "createdAt": "2026-06-28T10:00:00.000Z",
  "updatedAt": "2026-06-28T10:00:00.000Z"
}
```

---

# 3. settings

アプリ設定を保存する。

## 用途

通知音、BGM、最後に選択したメニューなどを保存する。

## フィールド

| フィールド名         | 型       | 必須 | 説明                      |
| -------------- | ------- | -- | ----------------------- |
| id             | string  | 必須 | 設定ID。基本は `app-settings` |
| selectedMenuId | string  | 任意 | 最後に選択した抽出メニューID         |
| alertEnabled   | boolean | 必須 | 通知音ON/OFF               |
| alertSound     | string  | 必須 | 通知音種類                   |
| alertVolume    | number  | 必須 | 通知音音量 0〜100             |
| bgmEnabled     | boolean | 必須 | BGM ON/OFF              |
| bgmTrack       | string  | 任意 | 選択中BGM                  |
| bgmVolume      | number  | 必須 | BGM音量 0〜100             |
| createdAt      | string  | 必須 | 作成日時                    |
| updatedAt      | string  | 必須 | 更新日時                    |

## 例

```json
{
  "id": "app-settings",
  "selectedMenuId": "menu_001",
  "alertEnabled": true,
  "alertSound": "bell",
  "alertVolume": 70,
  "bgmEnabled": true,
  "bgmTrack": "morning-coffee",
  "bgmVolume": 60,
  "createdAt": "2026-06-28T10:00:00.000Z",
  "updatedAt": "2026-06-28T10:00:00.000Z"
}
```

---

# 4. brewLogs

抽出履歴を保存する。

## 用途

いつ、どの豆を、どのレシピで淹れたかを記録する。

## フィールド

| フィールド名       | 型      | 必須 | 説明           |
| ------------ | ------ | -- | ------------ |
| id           | string | 必須 | 一意のID        |
| beanId       | string | 任意 | 使用した豆ID      |
| beanName     | string | 任意 | 使用した豆名       |
| menuId       | string | 任意 | 使用した抽出メニューID |
| menuName     | string | 任意 | 使用した抽出メニュー名  |
| bgmTrack     | string | 任意 | 使用したBGM      |
| totalSeconds | number | 必須 | 総抽出時間        |
| memo         | string | 任意 | 抽出メモ         |
| createdAt    | string | 必須 | 作成日時         |

## 将来追加候補

| フィールド名    | 型      | 説明     |
| --------- | ------ | ------ |
| grindSize | string | 挽き目    |
| waterTemp | number | 湯温     |
| beanGram  | number | 豆量     |
| waterMl   | number | 湯量     |
| rating    | number | 抽出結果評価 |

## 例

```json
{
  "id": "log_001",
  "beanId": "bean_001",
  "beanName": "エチオピア イルガチェフェ",
  "menuId": "menu_001",
  "menuName": "メニュー1",
  "bgmTrack": "morning-coffee",
  "totalSeconds": 150,
  "memo": "甘みが出てよかった。",
  "createdAt": "2026-06-28T10:00:00.000Z"
}
```

---

# IDルール

IDは文字列で保存する。

例

```text
menu_日付または乱数
bean_日付または乱数
log_日付または乱数
```

例

```text
bean_20260628_001
menu_20260628_001
log_20260628_001
```

---

# 日付ルール

日時は ISO 8601 形式で保存する。

例

```text
2026-06-28T10:00:00.000Z
```

画面表示時に日本語形式へ変換する。

例

```text
2026年6月28日
```

---

# Supabase移行方針

将来 Supabase を利用する場合も、基本的にこの構造を維持する。

## Supabaseテーブル候補

```text
brew_menus
beans
settings
brew_logs
```

IndexedDB の objectStore 名とは少し異なってもよいが、データ構造はできるだけ同じにする。

---

# 開発メモ

最初に実装する優先順位

1. settings
2. brewMenus
3. beans
4. brewLogs

理由

現在のCoffee Timerには、すでに

* メニュー
* 通知音
* BGM

が存在するため、まず settings と brewMenus を IndexedDB 化する。

その後、beans と brewLogs を追加する。
