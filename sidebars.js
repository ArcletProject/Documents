// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Arclet Docs',
      items:[
        'intro'
      ]
    },
    {
      type: 'category',
      label: "Alconna",
      items: [
        'alconna/tutorial',
        `alconna/before-start`,
        'alconna/entry',
        // {
        //   type: 'category',
        //   label: "组件",
        //   items: [
        //     'alconna-command-node',
        //     'alconna-args',
        //     'alconna-opt-and-sub',
        //     'alconna-arpamar',
        //   ].map(value => `alconna/basic/${value}`)
        // },
        'alconna/construct',
        'alconna/args',
        'alconna/header',
        // {
        //   type: 'category',
        //   label: "构造方法",
        //   items: [
        //     'typical',
        //     'koishi-like',
        //     'format',
        //     'fire-like',
        //     'click-like',
        //   ].map(value => `alconna/constructs/${value}`)
        // },
        // {
        //   type: 'category',
        //   label: "周边",
        //   items: [
        //     'help-doc',
        //     'alconna-pattern',
        //     'duplication',
        //     'fuzzy-match',
        //   ].map(value => `alconna/util/${value}`)
        // },
        // 'alconna/analysis',
        // {
        //   type: 'category',
        //   label: "细节应用",
        //   items: [
        //     'strange-command',
        //     'much-args',
        //     'custom-sep',
        //     'shortcut',
        //     'oplike-args'
        //   ].map(value => `alconna/detail/${value}`)
        // },
        // 'alconna/commandline',
        // 'alconna/manager',
        // 'alconna/lang-config',
        // 'alconna/extra',
        // 'alconna/changelog',
      ]
    },
    {
      type: 'category',
      label: "NEPattern",
      items: [
        'nepattern/tutorial',
      ]
    }
    // {
    //   type: 'category',
    //   label: 'Letoderea',
    //   items:[
    //     'letoderea/tutorial',
    //     'letoderea/fast-start',
    //     {
    //       type: 'category',
    //       label: "基础",
    //       items: [
    //         'event',
    //         'auxiliary',
    //       ].map(value => `letoderea/basic/${value}`)
    //     },
    //   ]
    // },
    // {
    //   type: 'category',
    //   label: 'Edoves',
    //   items:[
    //     'edoves/tutorial',
    //     {
    //       type: 'category',
    //       label: "入门",
    //       items: [
    //         'hello-world',
    //         'explain',
    //       ].map(value => `edoves/fast-start/${value}`)
    //     },
    //     {
    //       type: 'category',
    //       label: "基础",
    //       items: [
    //         'interact',
    //         'scene',
    //       ].map(value => `edoves/edoves-basic/${value}`)
    //     },
    //   ]
    // },
  ],
};

module.exports = sidebars;
