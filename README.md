# Benchmark of different array to tree implementations

Benchmark of the following packages with a randomly generated list of nodes

* [performant-array-to-tree](https://www.npmjs.com/package/performant-array-to-tree)
* [array-to-tree](https://www.npmjs.com/package/array-to-tree)
* [un-flatten-tree](https://www.npmjs.com/package/un-flatten-tree)
* [o-unflatten](https://www.npmjs.com/package/o-unflatten)

## Run

1. `npm install`
1. `npm run benchmark`

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