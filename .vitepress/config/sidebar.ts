const tutorial = [
  {
    text: "",
    items: [
      { text: "概览", link: "/tutorial/intro.md" },
    ]
  },
  {
    text: "教程",
    items: [
      {
        text: "Alconna",
        collapsed: true,
        items: [
          { text: "1.8", link: "/tutorial/alconna/v1.md" },
          { text: "2.0", link: "/tutorial/alconna/v2.md" }
        ]
      },
      {
        text: "NEPattern",
        collapsed: true,
        items: [
          { text: "0.6", link: "/tutorial/nepattern/v0.md" },
          { text: "1.0", link: "/tutorial/nepattern/v1.md" }
        ]
      },
      {
        text: "Cithun",
        link: "/tutorial/cithun.md"
      },
      {
        text: "Letoderea",
        link: "/tutorial/letoderea.md"
      },
      {
        text: "Entari",
        link: "/tutorial/entari/index.md",
        items: [
          { text: "服务器", link: "/tutorial/entari/server.md" },
          { text: "数据库", link: "/tutorial/entari/database.md" },
        ]
      },
      {
        text: "Tarina",
        link: "/tutorial/tarina.md"
      }
    ]
  }
]

export default {
  "/tutorial/": tutorial,
}
