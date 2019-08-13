# Benchmark of different array to tree implementations

Since the implementations treat different edge cases differently, there are 2 different benchmarks in this repository:

## 1. Small Benchmark

`npm run benchmark-small`

A small benchmark that compares the following packages with a small tree of only 5 nodes:

a) `performant-array-to-tree`
b) `array-to-tree`
c) `un-flatten-tree`
d) `o-unflatten`

### Results:

```
performant-array-to-tree    x 381,628 ops/sec       ±3.87%      (75 runs sampled)
array-to-tree               x 129,793 ops/sec       ±12.66%     (69 runs sampled)
un-flatten-tree             x 1,009,703 ops/sec     ±5.47%      (81 runs sampled)
o-unflatten                 x 317,840 ops/sec       ±4.42%      (78 runs sampled)
Fastest is un-flatten-tree
```

## 2. Big Benchmark

`npm run benchmark-big`

A big benchmark that compares the following packages with a big tree of 1000 nodes:
    a) `performant-array-to-tree`
    b) `un-flatten-tree`

### Results:

```
performant-array-to-tree    x 10,347 ops/sec        ±1.89%      (80 runs sampled)
un-flatten-tree             x 109 ops/sec           ±0.52%      (77 runs sampled)
Fastest is performant-array-to-tree
```
