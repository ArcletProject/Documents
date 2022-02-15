const alconna = [
  {
    'text': 'alconna --help',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'Alconna_CL\n可用的子命令有:\n# 开始创建 Alconna 命令\n  create\n## 该子命令内可用的选项有:\n # 指定命令名称\n  -C, --command <command_name>\n # 传入命令头\n  -H, --header <command_header>\n # 创建命令选项\n  -O, --option <option_name> <option_args, default=[]>\n # 展示创建命令的生成代码\n  -S, --show\n# 展示指定Alconna组件的帮助信息\n  help <target>',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const usage1 = [
 {
    'text': 'w.analyse_message("查询北京天气").header',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '\'北京\'',
    'cmd': false
  },
  {
    'text': 'd.analyse_message(".d100").header',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '\'100\'',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const usage2 = [
  {
    'text': 'msg = \"Cal -sum 12 23\"',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'cal.analyse_message(msg).get(\'sum\')',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '{\'num_a\': \'12\', \'num_b\': \'23\'}',
    'cmd': false
  },
  {
    'text': 'msg = \"Cal -div 12 23 --round 2\"',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'cal.analyse_message(msg).get(\'div\')',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '{\'num_a\': \'12\', \'num_b\': \'23\', \'round\': {\'decimal\': \'2\'}}',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const usage3 = [
 {
    'text': 'alc.analyse_message(\"叔叔今天吃什么啊?\").header',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '\'叔叔\'',
    'cmd': false
  },
  {
    'text': 'alc.analyse_message(\"叔叔今天吃tm和tm呢\").item',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '[\'tm\', \'tm呢\']',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const usage4 = [
 {
    'text': 'msg = MessageChain.create(At(12345), \" 丢漂流瓶 \", \"I L U\")',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'test.analyse_message(msg).main_args',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '{\'content\': \'I L U\'}',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

export {alconna, usage1, usage2, usage3, usage4};