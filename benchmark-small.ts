import Benchmark from 'benchmark'
import { arrayToTree as performantArrayToTree } from 'performant-array-to-tree'
import arrayToTree from 'array-to-tree'
import { unflatten as unFlattenTree } from 'un-flatten-tree'
import oUnflatten from 'o-unflatten'
import { strict as assert } from 'assert'

const input = [
  { id: '96', parentId: '92', custom: 'a' },
  { id: '97', parentId: '1', custom: 'very' },
  { id: '98', parentId: '42', custom: 'interesting' },
  { id: '99', parentId: null, custom: 'and' },
  { id: '100', parentId: '4', custom: 'exciting' },
  { id: '90', parentId: '42', custom: 'comparison' },
  { id: '91', parentId: '4', custom: 'with' },
  { id: '92', parentId: '31', custom: 'small' },
  { id: '93', parentId: '92', custom: 'sample' },
  { id: '94', parentId: '1', custom: '_' },
  { id: '95', parentId: '31', custom: '__' },
  { id: '4', parentId: null, custom: 'abc' },
  { id: '31', parentId: '4', custom: '12' },
  { id: '42', parentId: '1', custom: 'my' },
  { id: '89', parentId: '1', custom: 'great' },
  { id: '1941', parentId: '418', custom: 'de' },
  { id: '1', parentId: null, custom: 'ZZZz' },
  { id: '418', parentId: null, custom: 'ü' },
]
// oUnflatten expects parentId 0 for root and a sorted input
const oUnflattenInput = input.map(replaceParentIdNullWith0).sort(compareParentId)

const expectedOutput = [
  { data: { id: "99", parentId: null, custom: "and" }, children: [] },
  {
    data: { id: "4", parentId: null, custom: "abc" }, children: [
      { data: { id: "100", parentId: "4", custom: "exciting" }, children: [] },
      { data: { id: "91", parentId: "4", custom: "with" }, children: [] },
      {
        data: { id: "31", parentId: "4", custom: "12" }, children: [
          {
            data: { id: "92", parentId: "31", custom: "small" }, children: [
              { data: { id: "96", parentId: "92", custom: "a" }, children: [] },
              { data: { id: "93", parentId: "92", custom: "sample" }, children: [] }
            ]
          },
          { data: { id: "95", parentId: "31", custom: "__" }, children: [] }
        ]
      }
    ]
  },
  {
    data: { id: "1", parentId: null, custom: "ZZZz" }, children: [
      { data: { id: "97", parentId: "1", custom: "very" }, children: [] },
      { data: { id: "94", parentId: "1", custom: "_" }, children: [] },
      {
        data: { id: "42", parentId: "1", custom: "my" }, children: [
          { data: { id: "98", parentId: "42", custom: "interesting" }, children: [] },
          { data: { id: "90", parentId: "42", custom: "comparison" }, children: [] }
        ]
      },
      { data: { id: "89", parentId: "1", custom: "great" }, children: [] }
    ]
  },
  {
    data: { id: "418", parentId: null, custom: "ü" }, children: [
      { data: { id: "1941", parentId: "418", custom: "de" }, children: [] }
    ]
  }
]
const arrayToTreeExpectedOutput = expectedOutput.map(outRemoveEmptyChildrenProperty).map(outRemoveDataProperty)
const oUnflattenExpectedOutput = expectedOutput.map(outReplaceParentIdNullWith0).map(outRemoveDataProperty)

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
    console.log('assert expected output for performantArrayToTree')
    assert.deepEqual(performantArrayToTreeOutput, expectedOutput)
    console.log('assert expected output for arrayToTree')
    assert.deepEqual(arrayToTreeOutput, arrayToTreeExpectedOutput)
    console.log('assert expected output for unFlattenTree')
    assert.deepEqual(unFlattenTreeOutput, expectedOutput)
    console.log('assert expected output for oUnflatten')
    assert.deepEqual(oUnflattenOutput, oUnflattenExpectedOutput)

    // console.log(this)
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });

interface Node {
  id: string
  parentId: string | null | number,
  [key: string]: any
}

interface OutNode extends Node {
  children?: OutNode[]
}

interface OutNodeData {
  data: Node
  children?: OutNodeData[]
}

function replaceParentIdNullWith0(node: Node): Node {
  return {
    ...node,
    parentId: node.parentId || 0
  }
}

function compareParentId(a: Node, b: Node): number {
  return parseInt(String(a.parentId), 10) - parseInt(String(b.parentId), 10)
}


function outReplaceParentIdNullWith0(node: OutNode | OutNodeData): OutNode | OutNodeData {
  if (node.data as OutNodeData) {
    return { ...node, data: replaceParentIdNullWith0(node.data) }
  }
  return replaceParentIdNullWith0(node as OutNode)
}

function outRemoveEmptyChildrenProperty(node: OutNode | OutNodeData): OutNode | OutNodeData {
  if (node.children && node.children.length > 0) {
    return {
      ...node,
      children: (node.children as any).map(outRemoveEmptyChildrenProperty),
    }
  }

  if (node.children && node.children.length === 0) {
    const { children, ...rest } = node
    return rest
  }

  return node
}

function outRemoveDataProperty(node: OutNode | OutNodeData): OutNode {
  if (node.children) {
    return {
      ...(node.data || node),
      children: (node.children as any).map(outRemoveDataProperty),
    }
  }

  return node.data || node
}
