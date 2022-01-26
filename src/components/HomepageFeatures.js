import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Alconna',
    description: (
      <p>
        便捷、高效、基于字典的命令解析器
        A Fast Command Analyser based on Dict
      </p>
    ),
  },
  {
    title: 'Edoves',
    description: (
      <p>
        基于 Cesloi 的新式抽象框架
        A new abstract framework based on Cesloi
      </p>
    ),
  },
  {
    title: 'Letoderea',
    description: (
      <p>
        基于异步框架，高性能、结果简洁的事件系统
        A high-performance, simple-structured event system, relies on asyncio
      </p>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
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
