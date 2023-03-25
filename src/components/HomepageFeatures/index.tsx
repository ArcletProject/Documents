import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  //Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Alconna',
    //Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <p>
        一个直观的、高性能、泛用的命令行参数解析器集成库
        A High-performance, Generality, Humane Command Line Arguments Parser Library
      </p>
    ),
  },
  {
    title: 'NEPattern',
    //Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <p>
        一个高效的负责类型验证与类型转换的库
        A library for pattern matching and type convert
      </p>
    ),
  },
  {
    title: 'Edoves',
    //Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <p>
        新一代简洁、抽象的Bot开发 SDK
        A new abstract and simple bot framework
      </p>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      {/*<div className="text--center">*/}
      {/*  <Svg className={styles.featureSvg} role="img" />*/}
      {/*</div>*/}
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <span>{description}</span>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
