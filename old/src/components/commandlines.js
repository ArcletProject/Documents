const createProgressFrames = (frameCount, progressCount, maxWidth, delay) => {
  const frames = []
  const step = Math.ceil(progressCount / frameCount)

  for (let i = 0; i < progressCount; i += step) {
    const progressText = ` ${i}/${progressCount}`
    const filledLen = progressText.length + 2
    const intervalCount = maxWidth - filledLen

    const filledCount = Math.ceil((i / progressCount) * intervalCount)
    const unfilledCount = intervalCount - filledCount
    const frame = `[${'#'.repeat(filledCount)}${'-'.repeat(unfilledCount)}] ${progressText}`

    frames.push({
      text: frame,
      delay
    })
  }

  return frames
}

const progress = [
  {
    text: 'yarn',
    cmd: true,
    delay: 80
  },
  {
    text: 'yarn install v1.6.0',
    cmd: false,
    delay: 80
  },
  {
    text: '[1/4] 🔍  Resolving packages...',
    cmd: false,
    delay: 80
  },
  {
    text: '[2/4] 🚚  Fetching packages...',
    cmd: false
  },
  {
    text: '[3/4] 🔗  Linking dependencies...',
    cmd: false,
    frames: createProgressFrames(250, 1000, 60, 5)
  },
  {
    text: '[4/4] 📃  Building fresh packages...',
    cmd: false,
    frames: createProgressFrames(100, 2000, 60, 5)
  },
  {
    text: '✨  Done in 4.01s.',
    cmd: false
  },
  {
    text: '',
    cmd: true
  }
]


const alconna = [
  {
    'text': 'alconna --help',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '* Alconna CLI 0.8.3\n# 当前可用的命令有:\n - create 开始创建 Alconna 命令\n - analysis 分析命令并转换为 Alconna 命令结构\n - help 展示指定Alconna组件的帮助信息\n - using 依据创建的 Alconna 来解析输入的命令\n# 输入\'命令名 --help\' 查看特定命令的语法',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]


const alconna_create = [
  {
    'text': 'alconna create --help',
    'cmd': true,
    'delay': 80
  },
  {
    'text': 'create\n开始创建 Alconna 命令\n可用的选项有:\n# 指定命令名称\n  --command, -C <command_name:str>\n#传入命令头\n  --header, -H <command_header:List[str]>\n#创建命令选项\n  --option, -O <option_name:str> <option_args:list, default=[]>\n# 从已经分析的命令结构中创建Alconna\n  --analysed, -A',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]


const strange = [
 {
    'text': 'w.parse("查询北京天气").header',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '{\'city\':\'北京\'}',
    'cmd': false
  },
  {
    'text': 'd.parse(".rd100").header',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '{\'count\':\'100\'}',
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
    'text': 'cal.parse(msg).main_args',
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
    'text': 'cal.parse(msg).all_matched_args',
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
    'text': 'alc.parse(\"叔叔今天吃什么啊?\").header',
    'cmd': true,
    'delay': 80
  },
  {
    'text': '{\'name\': \'叔叔\'}',
    'cmd': false
  },
  {
    'text': 'alc.parse(\"叔叔今天吃tm和tm呢\").item',
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



const shortcut = [
 {
    'text': 'github.parse(\"!github repo ArcletProject/Alconna\").repo',
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
    'text': 'github.parse(\"查看ALC\").repo',
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
  },
  {
    'text': '',
    'cmd': true
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

const fuzzy_match = [
    {
    'text': 'alc.parse("tets_fuzzy 123")',
    'cmd': true,
    'delay': 40
    },
    {
        'text': 'tets_fuzzy is not matched. Do you mean "test_fuzzy"?\nmatched=False, head_matched=True, error_data=[\'123\'], error_info=None',
        'cmd': false
    },
    {
        'text': '',
        'cmd': true
    }
]


const custom_lang = [
 {
    'text': 'alc.parse("!command --baz abc")',
    'cmd': true,
    'delay': 40
  },
  {
    'text': 'Traceback (most recent call last):\narclet.alconna.exceptions.ParamsUnmatched: 以下参数没有被正确解析哦~\n: --baz\n请主人检查一下命令是否正确输入了呢~',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

export {
    progress,
    alconna,
    strange,
    much_args,
    custom_sep,
    shortcut,
    cool_down,
    oplike,
    fuzzy_match,
    custom_lang,
    alconna_create
};
