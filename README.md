# qtsukuba-score-manager
2018年度[雙峰祭](https://www.sohosai.tsukuba.ac.jp/)とQ-Tsukubaのための得点表示システムです。

![control](./demo/control.png)
![view](./demo/view.png)


## Install/Uninstall
### Windows(インストーラを使用する場合)
`qtsukuba-score-manager Setup x.x.x.exe`を実行すると、インストールののち直ちにアプリケーションが起動します。使用後は通常の手順に則ってアンインストールしてください。

### Windows(ポータブル版を使用する場合)
`portable`フォルダの中で`qtsukuba-score-manager.exe`を実行するとアプリケーションが起動します。アンインストールは必要はありません。不要になったらフォルダごとゴミ箱に捨ててください。

### Mac
後述の説明にしたがってビルドし、実行ファイルを生成してください。


## Usage
### ゲームのセットアップ
1. 「プレイヤーを追加」のボタンから適当な人数のプレイヤーを追加し、プレイヤー名を入力する
1. 「ルール」のドロップダウンリストから適当なルールを選択する
1. メニューバーの「表示」から「得点表示ウィンドウ」を生成する
1. ゲームが始まったら「得点表示画面を描画する」のボタンをクリックする

### クイズの読み込み
メニューバーの「制御」から「CSVから問題を読み込む」または「画像フォルダから問題を読み込む」を選択するとダイアログが表示されます。後述の形式に則って作られたCSVまたはフォルダを1つ以上選択してOKを押下すると問題が読み込まれます。読み込まれた問題は「選択中のジャンル」のドロップダウンリストから参照できます。

#### CSVから読み込む場合
CSVの形式は1列目に問題、2列目に答えとし、ファイル名は`<ジャンル名>.csv`としてください。CSVの3列目以降には何を記述しても無視されます。

#### 画像フォルダから読み込む場合
フォルダ名は`<ジャンル名>`とし、画像ファイル名は`<ソートキー>_<問題文>_<答え>.<jpgまたはpng>`としてください。フォルダの中にある画像でないファイルや、名前が不正な画像ファイルは無視されます。問題はソートキー文字列の辞書順で登録されます。

### スコア管理
ボタンを点けた人の「解答権」をクリックし、すべての正解者の「正解」をクリックしたのち、「スコア処理」をクリックしてください。

手動でスコアを修正する場合は、テキストボックスにフォーカスした後、矢印キーを押下するか直接半角英数でスコアを入力してください。


## Build
**Windowsユーザはビルドの必要はありません。** Releaseタブから最新版のビルド済みファイルをダウンロードしてください。

ビルドには[npm](https://www.npmjs.com/)が必要です。

Windowsユーザはルートディレクトリで以下を実行してください。
Macユーザは`npm run build`の代わりに`npm run build:mac`を実行してください。

``` bash
npm install
npm run build
```

もしあなたが開発者ならば、以下のスクリプトでhot reloadingを有効にした状態で試運転できます。

``` bash
npm run dev
```


---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[dab4535](https://github.com/SimulatedGREG/electron-vue/tree/dab4535ddea5bb2f8cb754c117d75cc1af2d1f5b) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
