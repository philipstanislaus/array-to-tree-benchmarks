import Benchmark from 'benchmark'
import { arrayToTree as performantArrayToTree, Item } from 'performant-array-to-tree'
import arrayToTree from 'array-to-tree'
import { unflatten as unFlattenTree } from 'un-flatten-tree'
import oUnflatten from 'o-unflatten'
import { strict as assert } from 'assert'

function randomElem<T>(arr: T[]): T {
  const id = Math.floor(Math.random() * arr.length)
  return arr[id]
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function generateRandomInputs(count: number): Node[] {
  const result: Node[] = [];

  for (let id = 1; id <= count; id++) {
    // have 10% of nodes at root, but at least 2
    const parentId = (id <= 2 || id < count * 0.1) ? null : randomElem(result).id
    const custom = Math.random()
    result.push({ id: String(id), parentId, custom: String(custom) })
  }

  // return shuffled result
  return shuffle(result)
}

const input = generateRandomInputs(1000)

// oUnflatten expects parentId 0 for root and a sorted input
const oUnflattenInput = input.map(replaceParentIdNullWith0).sort(compareParentId)
// console.log('oUnflattenInput')
// console.log(JSON.stringify(oUnflattenInput, undefined, 2))

const expectedOutput: OutNodeData[] = performantArrayToTree(input as Item[]) as OutNodeData[]
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
    performantArrayToTreeOutput = performantArrayToTree(input as Item[])
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
