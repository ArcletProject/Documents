const alconna = [
  {
    'text': 'alconna --help',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '* Alconna CL\n# 当前可用的命令有:\n - create 开始创建 Alconna 命令\n - analysis 分析命令并转换为 Alconna 命令结构\n - help 展示指定Alconna组件的帮助信息\n - using 依据创建的 Alconna 来解析输入的命令\n# 输入\'命令名 --help\' 查看特定命令的语法',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const strange = [
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
    'text': 'd.analyse_message(".ra").header',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'True',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const much_args = [
  {
    'text': 'msg = \"Cal -sum 12 23\"',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'cal.analyse_message(msg).main_args',
    'cmd': true
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
    'text': 'cal.analyse_message(msg).all_matched_args',
    'cmd': true
  },
  {
    'text': '{\'num_a\': \'12\', \'num_b\': \'23\', \'decimal\': \'2\'}',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const custom_sep = [
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

const mutli_arg = [
 {
    'text': 'alc = Alconna.from_string("/test <*tag:str>")',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'alc.analyse_message("/test foo bar baz").main_args',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '[\'foo\', \'bar\', \'baz\']',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const shortcut = [
 {
    'text': 'github.analyse_message(\"!github repo ArcletProject/Alconna\").repo',
    'cmd': true
  },
  {
    'text': 'ArcletProject/Alconna',
    'cmd': false
  },
  {
    'text': 'github.shortcut("查看ALC", "!github repo ArcletProject/Alconna")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': 'github.analyse_message(\"查看ALC\").repo',
    'cmd': true
  },
  {
    'text': 'ArcletProject/Alconna',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

export {alconna, strange, much_args, custom_sep, mutli_arg, shortcut};