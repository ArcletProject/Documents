// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/okaidia');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

/** @type {import('@docusaurus/types').Config} */
const config = {
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN"],
    localeConfigs: {
      "zh-CN": {
        label: "简体中文",
        direction: "ltr",
      },
    },
  },
  title: 'Arclet Project Document',
  tagline: 'Arclet 下所有项目的文档 (施工中)',
  url: 'https://arclet.top',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ArcletProject', // Usually your GitHub org/user name.
  projectName: 'Arclet', // Usually your repo name.
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/ArcletProject/Documents/edit/main/docs/',
        },
        blog: {
          blogTitle: 'Arclet Blog',
          blogDescription: 'Something write for Arclet',
          postsPerPage: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-live-codeblock', '@docusaurus/theme-mermaid'],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'ArcletProject',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            activeBasePath: 'docs',
            to: 'docs/intro',
            position: 'left',
            label: 'Arclet介绍',
          },
          {
            to: '/blog',
            label: 'Arclet博客',
            position: 'left'
          },
          {
            href: 'https://github.com/ArcletProject',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: 'Alconna',
                to: '/docs/alconna/tutorial',
              },
              {
                label: 'NEPattern',
                to: '/docs/nepattern/tutorial',
              },
            ],
          },
          {
            title: '相关项目',
            items: [
              {
                label: 'Alconna',
                href: 'https://github.com/ArcletProject/Alconna'
              },
              {
                label: 'NEPattern',
                href: 'https://github.com/ArcletProject/NEPattern'
              },
              {
                label: 'Letoderea',
                href: 'https://github.com/ArcletProject/Letoderea'
              }
            ]
          },
          {
            title: '社区 - Community',
            items: [
              {
                label: 'QQ Group',
                href: 'https://jq.qq.com/?_wv=1027&k=PUPOnCSH',
              },
              {
                label: 'Github Organization',
                href: 'https://github.com/ArcletProject',
              }
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ArcletProject. 由 Docusaurus Ⅱ 强力驱动.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['powershell', 'abnf'],
      },
    }),
};

module.exports = config;
