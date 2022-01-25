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
          label: "Command",
          items: [
            'command-analyser',
            'command-structure',
          ].map(value => `alconna/command/${value}`)
        },
        {
          type: 'category',
          label: "Basic",
          items: [
            'alconna-construct',
            'alconna-template-command',
            'alconna-opt-and-sub',
            'alconna-arpamar',
          ].map(value => `alconna/basic/${value}`)
        },
        {
          type: 'category',
          label: "Details",
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
        'edoves/tutorial'
      ]
    },
  ],
};