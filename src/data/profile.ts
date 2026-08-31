export interface SocialLink {
  name: string
  icon: string
  href: string
  color?: string
}

export interface Skill {
  name: string
  category: 'program' | 'engine' | 'test' | 'tool' | 'perf' | 'collab'
  level?: 1 | 2 | 3
}

export interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  description: string
  side: 'left' | 'right'
  tag?: 'work' | 'edu'
}

export interface ProfileData {
  name: string
  title: string
  headline: string
  avatarUrl: string
  about: string
  socials: SocialLink[]
  skills: Skill[]
  timeline: TimelineItem[]
  sinceYear: number
}

const profile: ProfileData = {
  name: 'Xing-ze',
  title: '游戏测试工程师',
  headline: '专注游戏品质与玩家体验 · 在代码与游戏世界之间寻找 Bug 的乐趣。24 岁，热爱技术与生活。',
  avatarUrl:
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20young%20man%20avatar%20cute%20handsome%20soft%20light%20pastel%20background%20game%20tester%20with%20controller%20chibi&image_size=square',
  about:
    '大家好，我是 Xing-ze，一名热爱游戏与技术的游戏测试工程师。过去几年中，我深度参与了多款 Unity / Unreal 项目的完整测试流程，从功能回归、性能分析到自动化框架搭建都有实战经验。\n\n在工作中，我擅长使用 Python 与 C# 编写高效的自动化脚本，借助 Airtest、UTF、Pytest 等工具构建可靠的测试流水线。同时，我也关注性能问题，常用 PerfDog、JMeter 对客户端与服务端进行深度压测与瓶颈分析。\n\n生活里我喜欢打游戏、看动漫、弹吉他，偶尔写写博客记录技术成长。希望能在这里分享我的学习笔记与项目经验，和更多同行一起交流进步。',
  socials: [
    {
      name: 'GitHub',
      icon: 'Github',
      href: 'https://github.com/Xing-ze',
      color: '#24292e',
    },
    {
      name: 'Email',
      icon: 'Mail',
      href: 'mailto:xing-ze@example.com',
      color: '#ea4335',
    },
    {
      name: 'Bilibili',
      icon: 'Tv',
      href: 'https://space.bilibili.com/0000000',
      color: '#fb7299',
    },
    {
      name: 'NeteaseMusic',
      icon: 'Music',
      href: 'https://music.163.com/#/user/home?id=00000000',
      color: '#c20c0c',
    },
    {
      name: 'Blog',
      icon: 'Globe',
      href: 'https://xing-ze.example.com',
      color: '#0ea5e9',
    },
  ],
  skills: [
    // program - 编程语言
    { name: 'Python', category: 'program', level: 3 },
    { name: 'C#', category: 'program', level: 2 },
    { name: 'Lua', category: 'program', level: 2 },
    { name: 'SQL', category: 'program', level: 2 },
    // engine - 游戏引擎
    { name: 'Unity', category: 'engine', level: 3 },
    { name: 'Unreal', category: 'engine', level: 2 },
    // test - 测试框架/工具
    { name: 'Airtest', category: 'test', level: 3 },
    { name: 'UTF', category: 'test', level: 2 },
    { name: 'Pytest', category: 'test', level: 3 },
    { name: 'JUnit', category: 'test', level: 2 },
    // perf - 性能工具
    { name: 'PerfDog', category: 'perf', level: 3 },
    { name: 'JMeter', category: 'perf', level: 2 },
    // tool - 抓包/接口工具
    { name: 'Charles', category: 'tool', level: 3 },
    { name: 'Fiddler', category: 'tool', level: 2 },
    { name: 'Postman', category: 'tool', level: 2 },
    // collab - 协作工具
    { name: 'Git', category: 'collab', level: 3 },
    { name: 'Jira', category: 'collab', level: 2 },
    { name: 'Jenkins', category: 'collab', level: 2 },
    { name: 'Bugzilla', category: 'collab', level: 1 },
  ],
  timeline: [
    {
      id: 't1',
      title: '游戏测试工程师 · 某某科技有限公司',
      subtitle: '2024.06 - 至今',
      description:
        '负责某中大型 RPG 手游的整体测试工作，搭建基于 Airtest + Pytest 的 UI 自动化测试框架，参与性能专项测试并推动多项内存/帧率优化。',
      side: 'left',
      tag: 'work',
    },
    {
      id: 't2',
      title: '计算机科学与技术 本科 · 某某大学',
      subtitle: '2020.09 - 2024.06',
      description:
        '主修软件工程、算法与数据结构、计算机图形学，毕业设计方向为「基于 Unity 的游戏自动化测试系统研究」，获优秀毕业论文。',
      side: 'right',
      tag: 'edu',
    },
    {
      id: 't3',
      title: '游戏测试实习生 · 某某互动娱乐',
      subtitle: '2023.07 - 2024.05',
      description:
        '参与多款休闲小游戏的功能测试与兼容性测试，独立编写 Jenkins Pipeline 实现自动化打包 + Monkey 测试，显著提升回归效率。',
      side: 'left',
      tag: 'work',
    },
    {
      id: 't4',
      title: '学生创新实验室 · 游戏开发小组组长',
      subtitle: '2022.03 - 2023.06',
      description:
        '带领 5 人小组完成一款 2D 横版解谜游戏 Demo（Unity），负责架构设计与玩法系统实现，获校级创新创业大赛二等奖。',
      side: 'right',
      tag: 'edu',
    },
  ],
  sinceYear: 2024,
}

export default profile
