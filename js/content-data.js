/* ============================================================
 *  打工充能站 · 今日挑战库 + 每日推荐库
 * ============================================================ */

// 通用挑战库（不分MBTI，随机补充）
const GENERAL_CHALLENGES = [
  { title: "喝满8杯水", desc: "今天的目标很简单——给身体补够水。你上一次喝水是什么时候？", icon: "💧" },
  { title: "站起来活动5分钟", desc: "每隔1小时站起来走走，拉伸一下。你的颈椎会感谢你。", icon: "🤸" },
  { title: "跟一个不熟的同事打个招呼", desc: "就一句'早'也行。社交从小步开始。", icon: "👋" },
  { title: "整理一下工位桌面", desc: "干净的桌面 = 清晰的大脑。花5分钟收拾一下。", icon: "🧹" },
  { title: "午休时离开工位", desc: "别在工位吃外卖了。出去走走，换个环境。", icon: "🚶" },
  { title: "给一个帮助过你的人发条感谢消息", desc: "不用长篇大论，一句'谢谢你上次帮我'就够了。", icon: "🙏" },
  { title: "今天不抱怨", desc: "挑战一整天不吐槽工作。你会发现，不抱怨的自己其实心情更好。", icon: "🤐" },
  { title: "提前5分钟到会议室", desc: "不是卷，是给自己喘口气的时间。", icon: "⏰" },
  { title: "写下一件今天感恩的事", desc: "哪怕很小很小——空调温度刚好、午饭好吃、准点下班。", icon: "📝" },
  { title: "下班后不看工作消息30分钟", desc: "给自己一段真正属于自己的时间。天塌不下来。", icon: "📵" },
  { title: "夸一个同事", desc: "真诚地夸一句。你会发现夸别人的时候自己心情也变好了。", icon: "🌟" },
  { title: "今天尝试一件没做过的事", desc: "哪怕是换一条上班路线、点一杯没喝过的咖啡。新鲜感是能量。", icon: "✨" },
  { title: "深呼吸3次再回复那条让你不爽的消息", desc: "冲动是魔鬼，冷静是天使。", icon: "😮‍💨" },
  { title: "午饭后散步10分钟", desc: "消食+换脑+晒太阳，一举三得。", icon: "🌞" },
  { title: "今天给自己安排一个小奖励", desc: "一杯好咖啡、一块小蛋糕、一首好歌。你值得。", icon: "🎁" }
];

// 每日电影推荐库
const DAILY_MOVIES = [
  {
    title: "白日梦想家",
    titleEn: "The Secret Life of Walter Mitty",
    quote: "停止做梦，开始生活。",
    quoteEn: "Stop dreaming, start living.",
    desc: "一个总在白日做梦的打工人，为了一张底片踏上真正的冒险之旅。看完想立刻请个假出去浪。",
    mood: "适合需要勇气走出舒适区的你",
    emoji: "🏔️"
  },
  {
    title: "穿普拉达的女王",
    titleEn: "The Devil Wears Prada",
    quote: "我不傻，我只是没在合适的时机做合适的事。",
    quoteEn: "I'm not stupid, I just haven't had the right timing.",
    desc: "职场新人的进阶指南。看完你会重新思考'成功'到底意味着什么。",
    mood: "适合正在纠结职业方向的你看",
    emoji: "👠"
  },
  {
    title: "心灵奇旅",
    titleEn: "Soul",
    quote: "你的火花不是你的目标，是你准备好去生活的那一刻。",
    quoteEn: "Your spark isn't your purpose, it's the moment you're ready to live.",
    desc: "一个太执着于目标的音乐家，灵魂出窍后发现：活着本身就是意义。",
    mood: "适合太焦虑目标而忘了生活的你看",
    emoji: "🎵"
  },
  {
    title: "实习生",
    titleEn: "The Intern",
    quote: "音乐家不会退休，直到心中没有音乐才会停下。",
    quoteEn: "Musicians don't retire; they stop when there's no more music in them.",
    desc: "70岁大爷去互联网公司当实习生的故事。看完觉得：职场不管几岁，心态最重要。",
    mood: "适合对工作感到疲惫需要打气的你看",
    emoji: "👔"
  },
  {
    title: "土拨鼠之日",
    titleEn: "Groundhog Day",
    quote: "如果每天都是同一天，你会怎么过？",
    quoteEn: "What if every day was the same day, how would you live it?",
    desc: "被困在同一天无限循环的男主，从绝望到享受每一天。打工人看完会心一笑。",
    mood: "适合觉得每天重复、需要找新意义的你看",
    emoji: "🌀"
  },
  {
    title: "阿甘正传",
    titleEn: "Forrest Gump",
    quote: "生活就像一盒巧克力，你永远不知道下一颗是什么。",
    quoteEn: "Life is like a box of chocolates, you never know what you're gonna get.",
    desc: "一个智商不高但真诚到极致的人，活出了最精彩的人生。看完想少想多做。",
    mood: "适合想太多、做太少的你看",
    emoji: "🍫"
  },
  {
    title: "千与千寻",
    titleEn: "Spirited Away",
    quote: "不管发生什么，永远不要回头。",
    quoteEn: "Once you've met someone, you never really forget them.",
    desc: "小女孩误入灵异世界打工还债的故事。本质是个职场生存指南。",
    mood: "适合在陌生环境里努力适应的你看",
    emoji: "🐉"
  },
  {
    title: "当幸福来敲门",
    titleEn: "The Pursuit of Happyness",
    quote: "如果你有梦想，就要去捍卫它。",
    quoteEn: "You got a dream, you gotta protect it.",
    desc: "真实故事改编。落魄父亲带儿子从无家可归到华尔街。看完觉得自己的苦也不算什么。",
    mood: "适合低谷期需要力量的你看",
    emoji: "🚪"
  },
  {
    title: "布达佩斯大饭店",
    titleEn: "The Grand Budapest Hotel",
    quote: "你瞧，在那个古老的时代，世界的边界还是用颜色来划分的。",
    quoteEn: "You see, in the old days, the borders of the world were still drawn in color.",
    desc: "韦斯·安德森的视觉盛宴。对称强迫症的福音，看完心情莫名变好。",
    mood: "适合需要审美治愈的你看",
    emoji: "🏨"
  },
  {
    title: "海上钢琴师",
    titleEn: "The Legend of 1900",
    quote: "城市那么大，看不到尽头。我停下来不是因为我所见，而是因为我所不见。",
    quoteEn: "The city is so big... I stopped not because of what I saw, but what I didn't see.",
    desc: "一个出生在船上、一辈子没下过船的钢琴天才。关于选择、关于归属、关于有限与无限。",
    mood: "适合在人生路口徘徊的你看",
    emoji: "🚢"
  },
  {
    title: "阳光小美女",
    titleEn: "Little Miss Sunshine",
    quote: "你知道什么是痛苦吗？真正的痛苦是，你努力了一切，最后还是输。",
    quoteEn: "You know what pain is? Real pain is when you try everything and still lose.",
    desc: "一家子各有各的丧，开着破大众送女儿选美。丧到极致反而治愈。",
    mood: "适合觉得全家/全组都在丧的你看",
    emoji: "🚐"
  },
  {
    title: "触不可及",
    titleEn: "The Intouchables",
    quote: "有时候你最需要的，不是一个同情你的人。",
    quoteEn: "Sometimes the last thing you need is pity.",
    desc: "瘫痪富翁和底层黑人的忘年交。不煽情但太好笑，太好笑但太感人。",
    mood: "适合需要被治愈又不想哭的你看",
    emoji: "🤝"
  },
  {
    title: "大佛普拉斯",
    titleEn: "The Great Buddha+",
    quote: "对他们来说，无论是出太阳还是下雨，都有困难。他们没办法想太多。",
    desc: "底层小人物的黑色幽默。看完又笑又叹，对'生活'两个字有了新理解。",
    mood: "适合需要换个视角看生活的你看",
    emoji: "佛像"
  },
  {
    title: "帕丁顿熊",
    titleEn: "Paddington",
    quote: "在伦敦，每个人都不一样，这意味着你可以做你自己。",
    quoteEn: "In London, everyone is different, which means anyone can fit in.",
    desc: "一只秘鲁小熊在伦敦找家的故事。治愈到你怀疑自己看了什么糖衣炮弹。",
    mood: "适合需要纯纯粹粹被暖到的你看",
    emoji: "🐻"
  },
  {
    title: "无问西东",
    titleEn: "Forever Young",
    quote: "愿你在迷茫时，坚信你的珍贵。",
    desc: "四代清华人的选择与传承。看完想认真活一次，不辜负这个时代。",
    mood: "适合需要找到内心方向的你看",
    emoji: "🕊️"
  }
];

// 每日歌曲推荐库
const DAILY_SONGS = [
  {
    title: "晴天",
    artist: "周杰伦",
    lyric: "故事的小黄花，从出生那年就飘着",
    desc: "前奏一响就是青春。适合在工位上偷偷戴耳机回忆从前。",
    mood: "怀旧充电",
    emoji: "🌿"
  },
  {
    title: "海阔天空",
    artist: "Beyond",
    lyric: "原谅我这一生不羁放纵爱自由",
    desc: "打工人的精神战歌。被需求虐完听一遍，满血复活。",
    mood: "燃向充电",
    emoji: "🔥"
  },
  {
    title: "兰亭序",
    artist: "周杰伦",
    lyric: "无关风月，我题序等你回",
    desc: "中国风的天花板。适合需要静心专注的时候听。",
    mood: "静心充电",
    emoji: "🖌️"
  },
  {
    title: "Counting Stars",
    artist: "OneRepublic",
    lyric: "Lately I've been losing sleep, dreaming about the things that we could be",
    desc: "节奏一响就想抖腿。适合下午犯困时听，比咖啡还提神。",
    mood: "活力充电",
    emoji: "⭐"
  },
  {
    title: "稻香",
    artist: "周杰伦",
    lyric: "对这个世界如果你有太多的抱怨，跌倒了就不敢继续往前走",
    desc: "周杰伦写给你的一封信：别抱怨了，回去看看稻田吧。",
    mood: "治愈充电",
    emoji: "🌾"
  },
  {
    title: "Here Comes the Sun",
    artist: "The Beatles",
    lyric: "Here comes the sun, and I say, it's all right",
    desc: "冬天的早上听，感觉自己就是那颗太阳。简简单单，暖暖的。",
    mood: "阳光充电",
    emoji: "☀️"
  },
  {
    title: "夜空中最亮的星",
    artist: "逃跑计划",
    lyric: "夜空中最亮的星，请指引我靠近你",
    desc: "加班到深夜时听，突然觉得自己不是一个人在战斗。",
    mood: "深夜充电",
    emoji: "🌠"
  },
  {
    title: "Viva La Vida",
    artist: "Coldplay",
    lyric: "I used to rule the world, seas would rise when I gave the word",
    desc: "气势磅礴。适合需要勇气做决定的时候听，感觉自己能征服一切。",
    mood: "王者充电",
    emoji: "👑"
  },
  {
    title: "南山南",
    artist: "马頔",
    lyric: "你在南方的艳阳里大雪纷飞，我在北方的寒夜里四季如春",
    desc: "民谣的忧伤刚刚好。适合心情低落时听，哭一场就好了。",
    mood: "情绪释放",
    emoji: "🍂"
  },
  {
    title: "倔强",
    artist: "五月天",
    lyric: "我和我最后的倔强，握紧双手绝对不放",
    desc: "被生活按在地上摩擦时听这首歌，然后站起来再战。",
    mood: "倔强充电",
    emoji: "✊"
  },
  {
    title: "Yellow",
    artist: "Coldplay",
    lyric: "Look at the stars, look how they shine for you",
    desc: "温柔到骨子里。适合黄昏下班路上听，看什么都觉得好看。",
    mood: "温柔充电",
    emoji: "💛"
  },
  {
    title: "追梦赤子心",
    artist: "GALA",
    lyric: "向前跑，迎着冷眼和嘲笑",
    desc: "虽然跑调但燃到爆。适合被打击后需要打鸡血的时候听。",
    mood: "热血充电",
    emoji: "🏃"
  },
  {
    title: "小幸运",
    artist: "田馥甄",
    lyric: "原来你是我最想留住的幸运",
    desc: "甜到心里。适合心情好的时候听，让好心情再翻倍。",
    mood: "甜蜜充电",
    emoji: "🍀"
  },
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    lyric: "Is this the real life? Is this just fantasy?",
    desc: "一首歌听完像看了一部歌剧。适合需要逃离现实五分钟的时候听。",
    mood: "奇幻充电",
    emoji: "🎤"
  },
  {
    title: "平凡之路",
    artist: "朴树",
    lyric: "我曾经跨过山和大海，也穿过人山人海",
    desc: "打工人主题曲。平凡没什么不好，平凡才是唯一的答案。",
    mood: "释然充电",
    emoji: "🛤️"
  }
];

// 每日问候语（根据时间段）
const GREETINGS = {
  morning: [
    "早安，打工人！今天也是元气满满（被迫）的一天～",
    "太阳升起，闹钟响起，你的打工魂开始燃烧了吗？",
    "新的一天，新的开始，新的...需求。冲鸭！",
    "今天也要做最闪亮的搬砖人！",
    "早！记得吃早饭，你的胃比KPI重要。"
  ],
  noon: [
    "午安！吃饱了才有力气打工，记得犒劳自己。",
    "中午了，该摸鱼了（嘘，我没说）。",
    "午休时间到！离开工位，给大脑重启一下。",
    "吃完饭别立刻工作，散散步消消食。",
    "下午的仗还很长，中午好好充个电。"
  ],
  afternoon: [
    "下午好！犯困了吗？来杯咖啡续个命。",
    "下午三点，打工人最难熬的时刻。撑住！",
    "再坚持一会儿，下班的光就在前方。",
    "下午茶时间！给自己一点甜。",
    "你的电量还剩多少？该充电啦。"
  ],
  evening: [
    "晚上好！今天辛苦了，该对自己好一点了。",
    "下班了吗？别忘了，你首先是你，然后才是打工人。",
    "夜晚是属于自己的时间。做点喜欢的事吧。",
    "今天的事今天了，明天的事...明天再说。",
    "辛苦一天了，给自己鼓个掌！"
  ],
  lateNight: [
    "夜深了，还在打工？注意身体，别熬太晚。",
    "这个世界不会因为你加班就对你温柔。早点休息。",
    "月亮都上班了，你还在上班？快去睡吧。",
    "深夜的灵魂需要安慰，但也需要睡眠。晚安。",
    "明天的事交给明天的自己，今晚就好好睡。"
  ]
};

// 今日运势总结短语（随机搭配）
const FORTUNE_SUMMARIES = [
  "今天运势不错，适合主动出击。",
  "今天宜稳不宜冲，做好手头的事就好。",
  "今天灵感爆棚，记得随手记下来。",
  "今天适合社交，多说一句话多一条路。",
  "今天适合独处充电，少开会多做事。",
  "今天有意外惊喜，保持开放心态。",
  "今天需要耐心，好事正在路上。",
  "今天能量在线，可以挑战有难度的事。",
  "今天宜断舍离，清理掉不需要的东西和情绪。",
  "今天适合复盘，整理一下最近的收获。",
  "今天贵人运旺，遇到困难别硬撑，求助也是一种能力。",
  "今天财运小旺，但别冲动消费。"
];
