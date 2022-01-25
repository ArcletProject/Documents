// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Arclet Project Document',
  tagline: 'Docs for Alconna, Edoves and so on',
  url: 'https://arcletproject.github.io',
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
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

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
          // {
          //   to: '/blog',
          //   label: 'Blog',
          //   position: 'left'
          // },
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
                label: 'Edoves',
                to: '/docs/edoves/tutorial',
              },
            ],
          },
          {
            title: '相关项目',
            items: [
              {
                label: 'Edoves',
                href: 'https://github.com/ArcletProject/Edoves'
              },
              {
                label: 'Alconna',
                href: 'https://github.com/ArcletProject/Alconna'
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
      },
    }),
};

module.exports = config;
