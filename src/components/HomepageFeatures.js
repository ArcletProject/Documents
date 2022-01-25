import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Alconna',
    description: (
      <p>
        A Fast Command Analyser based on Dict
      </p>
    ),
  },
  {
    title: 'Edoves',
    description: (
      <p>
        A new abstract framework based on Cesloi
      </p>
    ),
  },
  {
    title: 'Letoderea',
    description: (
      <p>
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
