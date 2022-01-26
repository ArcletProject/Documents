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
        {
          type: 'category',
          label: "Alconna基础",
          items: [
            'alconna-construct',
            'alconna-template-command',
            'alconna-opt-and-sub',
            'alconna-arpamar',
          ].map(value => `alconna/basic/${value}`)
        },
        {
          type: 'category',
          label: "Alconna细节",
          items: [
            'special-construct',
            'help-doc',
            'alconna-args',
            'alconna-pattern',
          ].map(value => `alconna/detail/${value}`)
        },
        'alconna/usage'
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
            'explain'
          ].map(value => `edoves/fast-start/${value}`)
        },
      ]
    },
  ],
};