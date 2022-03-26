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

const multi_arg = [
 {
    'text': 'from arclet.alconna.analysis import analyse_option',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'analyse_option(opt, "test foo bar baz")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': '[\'test\', {\'foo\': [\'foo\', \'bar\', \'baz\']}]',
    'cmd': false
  },
  {
    'text': 'analyse_option(opt1, "test a=1 b=2 c=3")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': '[\'test\', {\'foo\': {\'a\': \'1\', \'b\': \'2\', \'c\': \'3\'}}]',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const anti_arg = [
 {
    'text': 'from arclet.alconna.analysis import analyse_option',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'analyse_option(opt, "test abc")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': '[\'test\', {\'foo\': \'abc\'}]',
    'cmd': false
  },
  {
    'text': 'analyse_option(opt1, "test a")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': 'Traceback (most recent call last):\narclet.alconna.exceptions.ParamsUnmatched: param a is incorrect',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const kwonly_arg = [
 {
    'text': 'from arclet.alconna.analysis import analyse_option',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'analyse_option(opt, "test foo=123")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': '[\'test\', {\'foo\': 123}]',
    'cmd': false
  },
  {
    'text': 'analyse_option(opt1, "test 123")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': 'Traceback (most recent call last):\narclet.alconna.exceptions.ParamsUnmatched: 123 missing its key. \nDo you forget to add \'foo=\'?',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

const optional_arg = [
 {
    'text': 'from arclet.alconna.analysis import analyse_option',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'analyse_option(opt, "test abc")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': 'Traceback (most recent call last):\narclet.alconna.exceptions.ParamsUnmatched: param abc is incorrect',
    'cmd': false
  },
  {
    'text': 'analyse_option(opt1, "test abc")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': '[\'test\', {}]',
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

const hidden = [
 {
    'text': 'alc.get_help()',
    'cmd': true,
    'delay': 40
  },
  {
    'text': 'test <foo:str>\nUnknown Information\n',
    'cmd': false
  },
  {
    'text': 'alc1.get_help()',
    'cmd': true,
    'delay': 40
  },
  {
    'text': 'test1 <foo>\nUnknown Information\n',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]


const cool_down = [
 {
    'text': 'python test_cooldown.py',
    'cmd': true,
    'delay': 40
  },
  {
    'text': 'matched=False, head_matched=True, error_data=[], error_info=操作过于频繁',
    'cmd': false
  },
  {
    'text': 'matched=True, head_matched=True, main_args={\'bar\': 1}',
    'cmd': false
  },
  {
    'text': 'matched=False, head_matched=True, error_data=[], error_info=操作过于频繁',
    'cmd': false
  },
  {
    'text': 'matched=True, head_matched=True, main_args={\'bar\': 3}',
    'cmd': false
  }
]


const oplike = [
 {
    'text': 'alc.parse("cut_img --height=640")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': 'matched=True, head_matched=True, main_args={"--width": 1280, "--height":640}',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

export {
    alconna,
    strange,
    much_args,
    custom_sep,
    multi_arg,
    shortcut,
    anti_arg,
    hidden,
    optional_arg,
    kwonly_arg,
    cool_down,
    oplike
};