import { PRESET_GAMES } from '../constants/presetGames';

export type RulebookEntry = {
  gameId: string;
  name: string;
  summary: string;
  players: string;
  duration: string;
  difficulty: '初級' | '中級' | '上級';
  youtubeUrl: string; // 空文字の場合はボタンをグレーアウト
  coverImage: string;
  spineColor: string; // 背表紙の色
};

// ゲームを追加する場合は、この配列にエントリを追記するだけで本棚に自動反映されます。
// coverImage: public/game-images/ に画像を追加してパスを指定してください。
// youtubeUrl: YouTube動画のURLを設定してください（未設定の場合は '' のままでOK）。
export const RULEBOOK_BASE: RulebookEntry[] = [
  {
    gameId: 'catan',
    name: 'カタン',
    summary:
      'プレイヤーは無人島「カタン」の開拓者となり、資源を集めて道・開拓地・都市を建設します。サイコロで産出される資源を交渉や交換でやりくりしながら、勝利点10点を目指して競い合います。交渉の駆け引きが最大の醍醐味です。',
    players: '3〜6人',
    duration: '75〜120分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=ewKFxwFKRbA',
    coverImage: '/game-images/catan.png',
    spineColor: '#7a2318',
  },
  {
    gameId: 'dominion',
    name: 'ドミニオン',
    summary:
      'デッキ構築型カードゲームの元祖。毎ターン手札からアクションカードや財宝カードを使い、属州などの勝利点カードを購入していきます。自分だけのデッキを育てていく感覚が楽しく、カードの組み合わせで毎回異なる戦略が生まれます。',
    players: '2〜6人',
    duration: '30〜60分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=vU08xzXtDjE',
    coverImage: '/game-images/dominion.png',
    spineColor: '#4a2460',
  },
  {
    gameId: 'codenames',
    name: 'コードネーム',
    summary:
      '2チームに分かれ、スパイマスターが1語のヒントで複数の単語カードを仲間に伝えます。相手チームのカードやタブーカードに触れずに、自チームのカードをすべて先に当てたチームの勝ち。シンプルなルールながら奥深い言葉遊びが楽しめます。',
    players: '2〜8人',
    duration: '15〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=JyOKQE_X0rE',
    coverImage: '/game-images/codenames.png',
    spineColor: '#1a4a6e',
  },
  {
    gameId: 'bang',
    name: 'バング！',
    summary:
      '西部劇をテーマにした役割隠匿ゲーム。保安官・副保安官・無法者・無頼漢の4つの役割が配られ、それぞれの勝利条件を目指します。カードで攻撃・防御・回復を行いながら、誰が味方で誰が敵なのかを見極めるのが肝です。',
    players: '4〜7人',
    duration: '20〜40分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=_fZmk00SYE4',
    coverImage: '/game-images/bang.png',
    spineColor: '#7a3010',
  },
  {
    gameId: 'pandemic',
    name: 'パンデミック',
    summary:
      '全員が協力して世界中に蔓延する4種の感染症を食い止める協力型ゲーム。各プレイヤーが異なる特殊能力を持つ役職を担当し、アウトブレイクを防ぎながら4種すべてのワクチンを開発することを目指します。',
    players: '2〜4人',
    duration: '45〜60分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=0NwzhENGcdI',
    coverImage: '/game-images/pandemic.png',
    spineColor: '#1e5c38',
  },
  {
    gameId: 'hanabi',
    name: 'ハナビ',
    summary:
      '自分の手札が見えない状態で、仲間の声がけを頼りに花火を正しい順番で打ち上げる協力型ゲーム。ヒントは数字か色のどちらか1つしか教えられません。最高25点満点を目指して、チームで情報を共有する緊張感が醍醐味です。',
    players: '2〜5人',
    duration: '25〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=3m2KL4Yjz_o',
    coverImage: '/game-images/hanabi.png',
    spineColor: '#6e2020',
  },
  {
    gameId: '7wonders',
    name: '7 Wonders',
    summary:
      '古代の7大文明を率いて、3時代にわたり建築・軍事・科学・商業を発展させるカードドラフトゲーム。手札から1枚選んでプレイしたら隣に渡すを繰り返し、最終的に最も繁栄した文明が勝ちます。多人数でも短時間で遊べます。',
    players: '2〜7人',
    duration: '30〜45分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=nzxSFIql29A',
    coverImage: '/game-images/7wonders.png',
    spineColor: '#7a5010',
  },
  {
    gameId: 'loveletter',
    name: 'ラブレター',
    summary:
      '王女に手紙を届けるために、わずか16枚のカードを使う小さなデッキのゲーム。自分の番に1枚引いて手元の2枚から1枚を使い、相手を脱落させながら最後まで残るか最高ランクのカードを持つことを目指します。',
    players: '2〜5人',
    duration: '20〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=_e4-8Q-Vzsc',
    coverImage: '/game-images/love-letter.png',
    spineColor: '#6e1a3a',
  },
  {
    gameId: 'dixit',
    name: 'ディクシット',
    summary:
      '幻想的なイラストカードを使った創造力ゲーム。語り手はカードのイメージを短い言葉や音で表現し、他のプレイヤーは自分の手札から似たカードを選んで混ぜます。語り手のヒントが難しすぎず簡単すぎないバランスが得点のカギです。',
    players: '3〜6人',
    duration: '30〜60分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=35TvEMx0NyU',
    coverImage: '/game-images/dixit.png',
    spineColor: '#3d1a58',
  },
  {
    gameId: 'werewolf',
    name: '人狼',
    summary:
      '村人と人狼に分かれた正体隠匿ゲーム。昼は全員で議論して人狼を追放し、夜は人狼が村人を1人食べます。村人チームは人狼を全員追放すれば勝ち、人狼チームは村人と同数以下になれば勝ちです。心理戦と説得力が勝負を決めます。',
    players: '5〜15人',
    duration: '30〜60分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=4AClQqFxoew',
    coverImage: '/game-images/werewolf.png',
    spineColor: '#1e2e3a',
  },
  {
    gameId: 'carcassonne',
    name: 'カルカソンヌ',
    summary:
      '中世フランスの城塞都市をテーマにしたタイル配置ゲーム。手番ごとにタイルを1枚引いて場に置き、道・城・草原・修道院などの地形を完成させます。駒（ミープル）を置くことで得点を獲得。シンプルながら終盤の駆け引きが熱い名作です。',
    players: '2〜5人',
    duration: '35〜45分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=sjcwooTjVB4',
    coverImage: '/game-images/carcassonne.png',
    spineColor: '#5a3a10',
  },
  {
    gameId: 'ticket-to-ride',
    name: 'チケット・トゥ・ライド',
    summary:
      '北米大陸を舞台にした鉄道路線構築ゲーム。手札の列車カードを使って都市間のルートを確保し、秘密の目的カードに書かれた都市間を繋いで得点を稼ぎます。ライバルに先を越されないよう、路線を素早く確保する判断力が求められます。',
    players: '2〜5人',
    duration: '45〜75分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=C_kKUuYP7Nw',
    coverImage: '/game-images/ticket-to-ride.png',
    spineColor: '#8a2020',
  },
  {
    gameId: 'terraforming-mars',
    name: 'テラフォーミング・マーズ',
    summary:
      '22世紀の火星を舞台に、企業として火星改造（テラフォーミング）を進めるエンジン構築型ゲーム。温度・酸素・海洋を上昇させつつ、プロジェクトカードを駆使して都市や森を建設。多様なカードの相乗効果を活かした大作戦略ゲームです。',
    players: '1〜5人',
    duration: '120〜180分',
    difficulty: '上級',
    youtubeUrl: 'https://www.youtube.com/watch?v=xLt6gY3AO4I',
    coverImage: '/game-images/terraforming-mars.png',
    spineColor: '#7a3a18',
  },
  {
    gameId: 'azul',
    name: 'アズール',
    summary:
      'ポルトガルの装飾タイル「アズレージョ」をテーマにした美しい抽象ゲーム。工場からタイルを選んで自分のボードに配置し、行を完成させることで得点を獲得。余ったタイルは減点になるため、相手の行動を読みながら慎重に選択する必要があります。',
    players: '2〜4人',
    duration: '30〜45分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=nmiDTNOXBsg',
    coverImage: '/game-images/azul.jpg',
    spineColor: '#1a3a5a',
  },
  {
    gameId: 'splendor',
    name: '宝石の煌き / Splendor',
    summary:
      'ルネサンス期の宝石商として宝石を集め、鉱山・輸送・商店などの発展カードを購入するエンジン構築ゲーム。宝石トークンを集めてカードを買い、カードが新たな宝石として機能します。シンプルながら読み合いが深く、繰り返し遊びたくなる名作です。',
    players: '2〜4人',
    duration: '30〜40分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=7co954Fe9Fs',
    coverImage: '/game-images/splendor.png',
    spineColor: '#2a4a2a',
  },
  {
    gameId: 'skull',
    name: 'スカル',
    summary:
      '花とドクロのチップを使ったブラフゲーム。自分のコースターに裏向きでチップを積み、競りで宣言した枚数をめくってドクロに当たらなければ勝ち。シンプルなルールの中に心理戦の駆け引きが凝縮された、どんな場でも盛り上がる傑作パーティゲームです。',
    players: '2〜6人',
    duration: '15〜45分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=aaU98cW63uY',
    coverImage: '/game-images/skull.png',
    spineColor: '#2a2a2a',
  },
  {
    gameId: 'blokus',
    name: 'ブロックス',
    summary:
      'テトリスのようなピースを使った陣取り抽象ゲーム。自分の色のピースを、すでに置いたピースの「角」だけが触れるように配置していきます。相手の邪魔をしながらより多くのピースを盤上に置いた人が勝ち。子供から大人まで楽しめるシンプルさが魅力です。',
    players: '2〜4人',
    duration: '20〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=HcI3jDQzlCE',
    coverImage: '/game-images/blokus.png',
    spineColor: '#1a1a6a',
  },
  {
    gameId: 'kingdomino',
    name: 'キングドミノ',
    summary:
      'ドミノのタイルを使って自分の王国を5×5マスに広げるタイル配置ゲーム。地形が合うようにタイルを繋げ、王冠マスの数×地形の広さで得点計算。選ぶタイルの順番が次の手番順に影響するため、欲張りすぎると先手を取られる絶妙なバランスです。',
    players: '2〜4人',
    duration: '15〜20分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=X0FG36bfPuQ',
    coverImage: '/game-images/kingdomino.jpg',
    spineColor: '#4a3a10',
  },
  {
    gameId: 'wingspan',
    name: 'ウイングスパン',
    summary:
      '170種以上の実在する鳥を集めて生息地を充実させる自然テーマのエンジン構築ゲーム。森・草原・湿地の3つの生息地に鳥カードを配置し、餌の確保・産卵・カード獲得の連鎖を育てます。美しいアートワークと重厚な戦略性を兼ね備えた現代の名作です。',
    players: '1〜5人',
    duration: '40〜70分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=EjcmfayOX1Y',
    coverImage: '/game-images/wingspan.png',
    spineColor: '#2a5a3a',
  },
  {
    gameId: 'timebomb',
    name: 'タイムボム',
    summary:
      '爆弾処理班と過激派に分かれた正体隠匿ゲーム。全員で輪になりカードを切り合い、爆弾処理班は全ての「セーフ」カードをめくれば勝利。過激派は1枚でも「爆弾」をめくらせれば勝利。限られたラウンドで信頼と疑惑が交錯する緊張感が癖になります。',
    players: '4〜8人',
    duration: '15〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=CCMmdl-O52k',
    coverImage: '/game-images/timebomb.png',
    spineColor: '#5a1a10',
  },
  {
    gameId: 'cockroach-poker',
    name: 'ごきぶりポーカー',
    summary:
      '動物カードを押し付け合うブラフゲーム。カードを裏向きで渡しながら「これはゴキブリです」などと宣言。相手は信じるか嘘と見抜くか選択し、間違えた人がカードをもらいます。同じ種類のカードを4枚集めた人の負けという独特のルールが会話を生み出します。',
    players: '2〜6人',
    duration: '20〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=GdlSa2mSev8',
    coverImage: '/game-images/cockroach-poker.png',
    spineColor: '#3a4a10',
  },
  {
    gameId: 'coyote',
    name: 'コヨーテ',
    summary:
      '自分のカードだけ見えない数字当てゲーム。全員が頭に数字カードを立て、場の合計値を推測しながら競り上げていきます。「コヨーテ！」と叫んで前のプレイヤーの宣言が嘘と見抜けるか、それとも自分が叫ばれるか。インディアンポーカーの感覚で楽しめる傑作です。',
    players: '2〜10人',
    duration: '20〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=x1A8j0fqpZU',
    coverImage: '/game-images/coyote.png',
    spineColor: '#6a4a10',
  },
  {
    gameId: 'nanjamo',
    name: 'ナンジャモンジャ',
    summary:
      '奇妙な生き物カードに名前をつけて、同じカードが出たら叫ぶ記憶ゲーム。初めて出たカードに好きな名前をつけ、同じキャラが再登場したらその名前を素早く叫びます。思わず笑ってしまうような名前が飛び交い、子供から大人まで大盛り上がりする定番パーティゲームです。',
    players: '2〜6人',
    duration: '15〜20分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=xYOwaZP2k10',
    coverImage: '/game-images/nanjamo.png',
    spineColor: '#5a2a5a',
  },
  {
    gameId: 'geistesblitz',
    name: 'おばけキャッチ',
    summary:
      'カードに描かれた2つのものをよく見て、特定の法則に従い正しいコマを素早くつかむ反射神経ゲーム。白いおばけ・赤い椅子・青い本・緑の瓶・灰色のねずみの5種のコマから、描かれていない色と描かれていない物を組み合わせた正解コマを最速でキャッチします。',
    players: '2〜8人',
    duration: '20〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=4UF6kd6JvgU',
    coverImage: '/game-images/geistesblitz.png',
    spineColor: '#4a1a5a',
  },
  {
    gameId: 'avalon',
    name: 'レジスタンス：アヴァロン',
    summary:
      'アーサー王伝説をテーマにした正体隠匿ゲーム。善の騎士と悪の手先に分かれ、クエストの成功・失敗を繰り返しながら相手陣営の正体を暴くか隠すかを競います。マーリンやアサシンなど特殊役職の駆け引きが深く、少人数でも激しい推理戦が楽しめます。',
    players: '5〜10人',
    duration: '30〜45分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=zrFCSvwiLzk',
    coverImage: '/game-images/avalon.jpg',
    spineColor: '#1a2a5a',
  },
  {
    gameId: 'secret-hitler',
    name: 'シークレットヒトラー',
    summary:
      '1930年代ドイツを舞台にした政治テーマの正体隠匿ゲーム。自由主義者とファシストに分かれ、立法を通じて政策を可決させていきます。ファシストは政策を操作しヒトラーを首相にするか5枚のファシスト政策を通せば勝利。議論と疑念が渦巻く高度な心理戦ゲームです。',
    players: '5〜10人',
    duration: '45〜60分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=UtxxaHfaDnw',
    coverImage: '/game-images/secret-hitler.jpg',
    spineColor: '#3a1a1a',
  },
  {
    gameId: 'everdell',
    name: 'エバーデール',
    summary:
      '森の生き物たちが集まる街を築くワーカープレイスメント×カードゲーム。四季の進行とともに資源を集め、動物キャラクターやイベントカードを場に出して都市を発展させます。美麗なアートワークと多様なカード効果の組み合わせで、プレイするたびに違う体験が楽しめます。',
    players: '1〜4人',
    duration: '40〜80分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=UhuyqMA_ROo',
    coverImage: '/game-images/everdell.jpg',
    spineColor: '#2a5a2a',
  },
  {
    gameId: 'istanbul',
    name: 'イスタンブール',
    summary:
      'グランドバザールを舞台にしたタイル移動型ゲーム。商人と助手を操り、バザールの16か所のタイルを巡って資源を集め、最初にルビーを5個獲得したプレイヤーが勝利。助手の配置と回収の管理がカギで、効率的なルートを組み立てる戦略性が高い中量級の名作です。',
    players: '2〜5人',
    duration: '40〜60分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=Gsa0-ZE5uno',
    coverImage: '/game-images/istanbul.jpg',
    spineColor: '#6a3a10',
  },
  {
    gameId: 'odin',
    name: 'オーディンの祝祭',
    summary:
      'バイキングをテーマにした大規模ワーカープレイスメントゲーム。60以上のアクションスペースから毎ターン選択し、漁・略奪・交易・移住など多彩な方法で資源を集め、ボードの隙間を埋めて得点を最大化します。複雑さと自由度の高さを誇る重量級の傑作です。',
    players: '1〜4人',
    duration: '60〜120分',
    difficulty: '上級',
    youtubeUrl: 'https://www.youtube.com/watch?v=cBdh9KxvK8o&t=111s',
    coverImage: '/game-images/odin.jpg',
    spineColor: '#1a2a4a',
  },
  {
    gameId: 'patchwork',
    name: 'パッチワーク',
    summary:
      '布のパッチを購入・配置してキルトを完成させる2人専用ゲーム。タイムトラックで手番が管理され、ボタンを支払ってパッチを購入し自分のボードに隙間なく配置することを目指します。7×7のボードを埋め切れない空白は減点になるため、パズル的な思考が求められます。',
    players: '2人',
    duration: '15〜30分',
    difficulty: '初級',
    youtubeUrl: '',
    coverImage: '/game-images/patchwork.png',
    spineColor: '#5a2a4a',
  },
  {
    gameId: '6nimmt',
    name: 'ニムト（6 nimmt!）',
    summary:
      '全員が同時にカードを1枚出し、昇順に並んだ4列のどこかに配置していくシンプルなカードゲーム。6枚目を置くことになったプレイヤーはその列を引き取り、カードに描かれた雄牛の数だけ失点します。読み合いと運が絶妙に絡み合う、2〜10人まで遊べる名作です。',
    players: '2〜10人',
    duration: '45分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=clK7ohTeHqI',
    coverImage: '/game-images/6nimmt.png',
    spineColor: '#4a2a10',
  },
  {
    gameId: 'cascadia',
    name: 'カスカディア',
    summary:
      '太平洋岸北西部の自然をテーマにしたタイル配置ゲーム。地形タイルと野生動物トークンをセットで取得し、動物ごとの配置パターンを達成して得点を稼ぎます。美しいアートワークと穏やかなプレイ感覚で、2023年ドイツ年間ゲーム大賞の優秀賞に輝いた話題作です。',
    players: '1〜4人',
    duration: '30〜45分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=z8CwK8eJ7I8',
    coverImage: '/game-images/cascadia.png',
    spineColor: '#2a5a3a',
  },
  {
    gameId: 'komplett',
    name: 'コンプレット',
    summary:
      '数字カードを使って自分のボードの数字マスを埋めていくビンゴ系ゲーム。共通のカードを使いながら、自分のボードに合った数字を戦略的に選びます。シンプルながら選択の妙が光り、家族や子どもにも優しいライトなルールで気軽に遊べます。',
    players: '2〜6人',
    duration: '20〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=ALy5LFWwRgk',
    coverImage: '/game-images/komplett.png',
    spineColor: '#3a3a6a',
  },
  {
    gameId: '5cucumbers',
    name: '5本のきゅうり',
    summary:
      '全員が手番ごとに1枚ずつカードを出し、最も高いカードを出せなかったプレイヤーがきゅうりを1本もらいます。5本たまった人の負けという、笑いが絶えないシンプルなカードゲーム。ルールが超簡単なので初めての方や子どもにもすぐ馴染めます。',
    players: '2〜6人',
    duration: '15〜20分',
    difficulty: '初級',
    youtubeUrl: '',
    coverImage: '/game-images/5cucumbers.jpg',
    spineColor: '#2a5a1a',
  },
  {
    gameId: 'machikoro',
    name: '街コロ',
    summary:
      'サイコロを振って収入を得ながら施設を建設し、ランドマークを完成させた人が勝ちの街づくりダイスゲーム。自分の番だけでなく相手の番にも収入が入る施設があるため、どの施設を建てるかの選択が重要です。カードゲームのような拡張性とサイコロの興奮を兼ね備えた人気作です。',
    players: '2〜4人',
    duration: '30〜45分',
    difficulty: '初級',
    youtubeUrl: '',
    coverImage: '/game-images/machikoro.png',
    spineColor: '#6a4a1a',
  },
  {
    gameId: 'tiger-dragon',
    name: 'タイガー＆ドラゴン',
    summary:
      '麻雀牌を使った2人対戦カードゲーム。タイガー・ドラゴン・数牌のカードを使いながら相手の出したカードを上回るカードを出し続け、手札を先に使い切ったプレイヤーが得点を獲得します。麻雀の知識がなくても楽しめるシンプルさと、高い戦略性が両立した傑作2人ゲームです。',
    players: '2〜5人',
    duration: '20〜40分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=wZi7PcgSpSQ',
    coverImage: '/game-images/tiger-dragon.png',
    spineColor: '#5a1a1a',
  },
  {
    gameId: 'citadels',
    name: 'あやつり人形',
    summary:
      '毎ラウンド秘密裏に役職を選び、その能力を使って金を集め建物を建設する役職選択型ゲーム。暗殺者・泥棒・魔術師など特殊能力を持つキャラクターを巧みに使い、8つの建物を最初に建てきったプレイヤーが勝利。読み合いと妨害が絶妙に絡み合う傑作カードゲームです。',
    players: '2〜8人',
    duration: '30〜60分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=ODVjS28JuJs',
    coverImage: '/game-images/citadels.png',
    spineColor: '#3a1a4a',
  },
  {
    gameId: 'ito',
    name: 'ito',
    summary:
      '1〜100の数字が書かれたカードを持ち寄り、テーマに沿った言葉で数字をヒントに出しながら小さい順に並べる協力ゲーム。自分のカードの数字は他のプレイヤーには見せられず、言葉だけで伝え合います。コミュニケーションと共感が試される、笑いと感動が生まれる傑作パーティゲームです。',
    players: '2〜10人',
    duration: '20〜30分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=nf-PJ_-kr8M',
    coverImage: '/game-images/ito.png',
    spineColor: '#1a4a5a',
  },
  {
    gameId: 'battleline',
    name: 'バトルライン',
    summary:
      '9本のフラッグを挟んで向かい合う2人用カード対戦ゲーム。各フラッグに3枚ずつカードを出し、ポーカーの役のような強さで競い合います。5本以上のフラッグを取るか、隣接する3本を連取すれば勝利。シンプルながら深い読み合いが光る、2人ゲームの名作です。',
    players: '2人',
    duration: '20〜30分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=crUS-L14egw',
    coverImage: '/game-images/battleline.png',
    spineColor: '#3a1a2a',
  },
  {
    gameId: 'draftsaurus',
    name: 'ドラフトサウルス',
    summary:
      '恐竜コマをドラフトして自分の遊園地に並べるタイル配置ゲーム。袋からランダムに引いた恐竜の中から1つを選んで自分の檻に置き、残りを隣へ回します。同じ種類を集めたり、多様性を生かしたりと戦略の幅が広く、短時間でも十分なプレイ感が楽しめる軽量ゲームです。',
    players: '2〜5人',
    duration: '15〜20分',
    difficulty: '初級',
    youtubeUrl: 'https://www.youtube.com/watch?v=n_tZXmOljh0',
    coverImage: '/game-images/draftsaurus.png',
    spineColor: '#2a4a2a',
  },
  {
    gameId: 'first-rat',
    name: 'ファーストラット',
    summary:
      'ネズミたちが月へ旅立つロケットに乗り込むことを目指すレースゲーム。ルートを進みながら食料を集め、家族のネズミ全員をロケットに乗せた人が勝利します。手番には複数の行動から選択でき、戦略性とかわいらしいテーマが絶妙に融合した中量級の傑作です。',
    players: '2〜5人',
    duration: '45〜60分',
    difficulty: '中級',
    youtubeUrl: 'https://www.youtube.com/watch?v=sVxaI6yqLDQ',
    coverImage: '/game-images/first-rat.jpg',
    spineColor: '#4a3a1a',
  },
];

// プリセットゲームが RULEBOOK_BASE にない場合、最低限の情報で自動補完してマージする
const SPINE_COLORS = [
  '#5a1a2a', '#1a3a5a', '#2a4a1a', '#4a1a4a', '#1a4a3a',
  '#5a3a1a', '#1a1a5a', '#4a2a1a', '#2a1a4a', '#3a4a1a',
  '#5a1a4a', '#1a5a3a', '#3a1a1a', '#1a3a1a', '#3a2a4a',
  '#4a3a1a', '#1a4a4a', '#5a2a2a', '#2a3a4a', '#4a1a2a',
];

const baseIds = new Set(RULEBOOK_BASE.map((e) => e.gameId));

const autoEntries: RulebookEntry[] = PRESET_GAMES
  .filter((g) => {
    // preset-xxx → xxx に変換して RULEBOOK_BASE と照合
    const gameId = g.id.replace(/^preset-/, '');
    // love-letter と loveletter の表記ゆれも吸収
    return !baseIds.has(gameId) && !baseIds.has(gameId.replace(/-/g, ''));
  })
  .map((g, i) => {
    const gameId = g.id.replace(/^preset-/, '');
    return {
      gameId,
      name: g.name,
      summary: '詳細情報は準備中です。',
      players: '—',
      duration: '—',
      difficulty: '初級' as const,
      youtubeUrl: '',
      coverImage: `/game-images/${gameId}.png`,
      spineColor: SPINE_COLORS[i % SPINE_COLORS.length],
    };
  });

// RULEBOOK_BASE + プリセットから自動生成したエントリを結合
export const RULEBOOK: RulebookEntry[] = [...RULEBOOK_BASE, ...autoEntries];
