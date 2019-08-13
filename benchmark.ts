import Benchmark from 'benchmark'
import { arrayToTree as performantArrayToTree } from 'performant-array-to-tree'
import arrayToTree from 'array-to-tree'
import { unflatten as unFlattenTree } from 'un-flatten-tree'
import oUnflatten from 'o-unflatten' // not considered, requires sorted array
import { strict as assert } from 'assert'

const input = [
  { id: '4', parentId: null, custom: 'abc' },
  { id: '31', parentId: '4', custom: '12' },
  { id: '1941', parentId: '418', custom: 'de' },
  { id: '1', parentId: '418', custom: 'ZZZz' },
  { id: '418', parentId: null, custom: 'ü' },
]
// oUnflatten expects parentId 0 for root and a sorted input
const oUnflattenInput = [
  { id: '4', parentId: 0, custom: 'abc' },
  { id: '418', parentId: 0, custom: 'ü' },
  { id: '31', parentId: '4', custom: '12' },
  { id: '1941', parentId: '418', custom: 'de' },
  { id: '1', parentId: '418', custom: 'ZZZz' },
]
const expectedOutput = [
  {
    data: { id: '4', parentId: null, custom: 'abc' }, children: [
      { data: { id: '31', parentId: '4', custom: '12' }, children: [] },
    ],
  },
  {
    data: { id: '418', parentId: null, custom: 'ü' }, children: [
      { data: { id: '1941', parentId: '418', custom: 'de' }, children: [] },
      { data: { id: '1', parentId: '418', custom: 'ZZZz' }, children: [] },
    ],
  },
]
const oUnflattenExpectedOutput = [
  {
    id: '4', parentId: 0, custom: 'abc', children: [
      { id: '31', parentId: '4', custom: '12', children: [] },
    ],
  },
  {
    id: '418', parentId: 0, custom: 'ü', children: [
      { id: '1941', parentId: '418', custom: 'de', children: [] },
      { id: '1', parentId: '418', custom: 'ZZZz', children: [] },
    ],
  },
]
const arrayToTreeExpectedOutput = [
  {
    id: '4', parentId: null, custom: 'abc', children: [
      { id: '31', parentId: '4', custom: '12' },
    ],
  },
  {
    id: '418', parentId: null, custom: 'ü', children: [
      { id: '1941', parentId: '418', custom: 'de' },
      { id: '1', parentId: '418', custom: 'ZZZz' },
    ],
  },
]
let performantArrayToTreeOutput: any
let arrayToTreeOutput: any
let unFlattenTreeOutput: any
let oUnflattenOutput: any

const suite = new Benchmark.Suite()

suite
  // add tests
  .add('performant-array-to-tree', () => {
    performantArrayToTreeOutput = performantArrayToTree(input)
  })
  .add('array-to-tree', () => {
    arrayToTreeOutput = arrayToTree(input, {
      parentProperty: 'parentId',
    })
  })
  .add('un-flatten-tree', () => {
    unFlattenTreeOutput = unFlattenTree(
      input,
      (node, parentNode) => node.parentId === parentNode.id,  // check if node is a child of parentNode
      (node, parentNode: any) => parentNode.children.push(node), // add node to parentNode
      node => ({ data: node, children: [] })                 // create output node
    );
  })
  .add('o-unflatten', () => {
    oUnflattenOutput = oUnflatten(oUnflattenInput)
  })

  // add listeners
  .on('cycle', function (event: any) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    assert.deepEqual(performantArrayToTreeOutput, expectedOutput)
    assert.deepEqual(arrayToTreeOutput, arrayToTreeExpectedOutput)
    assert.deepEqual(unFlattenTreeOutput, expectedOutput)
    assert.deepEqual(oUnflattenOutput, oUnflattenExpectedOutput)

    // console.log(this)
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });
