module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Arclet',
      items:[
        'intro'
      ]
    },
    {
      type: 'category',
      label: "Alconna",
      items: [
        'alconna/tutorial',
        {
          type: 'category',
          label: "命令基础",
          items: [
            'command-analyser',
            'command-structure',
          ].map(value => `alconna/command/${value}`)
        },
        'alconna/entry',

        {
          type: 'category',
          label: "组件",
          items: [
            'alconna-template-command',
            'alconna-args',
            'alconna-opt-and-sub',
            'alconna-arpamar',
          ].map(value => `alconna/basic/${value}`)
        },
        {
          type: 'category',
          label: "构造方法",
          items: [
            'typical',
            'koishi-like',
            'format',
            'simple',
            'click-like',
          ].map(value => `alconna/constructs/${value}`)
        },
        {
          type: 'category',
          label: "细节",
          items: [
            'help-doc',
            'alconna-pattern',
            'parse-order'
          ].map(value => `alconna/detail/${value}`)
        },
        'alconna/usage',
        'alconna/commandline',
        'alconna/manager',
      ]
    },
    {
      type: 'category',
      label: 'Edoves',
      items:[
        'edoves/tutorial',
        {
          type: 'category',
          label: "入门",
          items: [
            'hello-world',
            'explain',
          ].map(value => `edoves/fast-start/${value}`)
        },
        {
          type: 'category',
          label: "基础",
          items: [
            'interact',
            'scene',
          ].map(value => `edoves/edoves-basic/${value}`)
        },
      ]
    },
  ],
};