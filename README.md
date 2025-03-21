# Benchmark of different array to tree implementations

Benchmark of the following packages with a randomly generated list of nodes

- [performant-array-to-tree](https://www.npmjs.com/package/performant-array-to-tree)
- [array-to-tree](https://www.npmjs.com/package/array-to-tree)
- [un-flatten-tree](https://www.npmjs.com/package/un-flatten-tree)
- [o-unflatten](https://www.npmjs.com/package/o-unflatten)
- [row-to(tree](https://www.npmjs.com/package/row-to-tree)

## Run

1. Install TypeScript if needed: `npm install typescript -g`, and update types if needed: `npm update typescript @types/node`
1. `npm install`
1. `npm run benchmark`

## Results for basic test

```
performant-array-to-tree        x 13,802 ops/sec    ±2.90%      (81 runs sampled)
array-to-tree                   x 2,247 ops/sec     ±2.64%      (85 runs sampled)
un-flatten-tree                 x 222 ops/sec       ±2.53%      (81 runs sampled)
o-unflatten                     x 18,247 ops/sec    ±3.20%      (80 runs sampled)
rowToTree                       x 13,532 ops/sec    ±3.16%      (84 runs sampled)
...
Fastest is performant-array-to-tree
```

## Results for 100 nodes

```
performant-array-to-tree        x 102,834 ops/sec   ±5.40%      (82 runs sampled)
array-to-tree                   x 9,850 ops/sec     ±27.20%     (71 runs sampled)
un-flatten-tree                 x 10,473 ops/sec    ±2.61%      (86 runs sampled)
o-unflatten                     x 52,485 ops/sec    ±22.39%     (39 runs sampled)
...
Fastest is performant-array-to-tree
```

## Results for 10,000 nodes

```
performant-array-to-tree        x 452 ops/sec       ±2.84%      (84 runs sampled)
array-to-tree                   x 81.06 ops/sec     ±1.69%      (66 runs sampled)
un-flatten-tree                 x 0.74 ops/sec      ±11.84%     (6 runs sampled)
o-unflatten                     x 322 ops/sec       ±2.74%      (73 runs sampled)
...
Fastest is performant-array-to-tree
```
