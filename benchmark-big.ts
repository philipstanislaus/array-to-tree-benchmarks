import Benchmark from 'benchmark'
import { arrayToTree as performantArrayToTree } from 'performant-array-to-tree'
import { unflatten as unFlattenTree } from 'un-flatten-tree'
import { strict as assert } from 'assert'

function generateRandomInputs(count: number): { id: string, parentId: string | null, custom: string }[] {
  if (count < 20) { throw new Error('Please use at least a count of 20, otherwise it\'s unlikely you get root elements.') }

  const result = [];
  for (let id = 0; id < count; id++) {
    const parentId = Math.floor(Math.random() * count * 1.2)
    const custom = Math.random()
    result.push({ id: String(id), parentId: parentId > count ? null : String(parentId), custom: String(custom) })
  }
  return result
}

const input = generateRandomInputs(1000)
const expectedOutput = performantArrayToTree(input)

let performantArrayToTreeOutput: any
let unFlattenTreeOutput: any

const suite = new Benchmark.Suite()

suite
  // add tests
  .add('performant-array-to-tree', () => {
    performantArrayToTreeOutput = performantArrayToTree(input)
  })
  .add('un-flatten-tree', () => {
    unFlattenTreeOutput = unFlattenTree(
      input,
      (node, parentNode) => node.parentId === parentNode.id,  // check if node is a child of parentNode
      (node, parentNode: any) => parentNode.children.push(node), // add node to parentNode
      node => ({ data: node, children: [] })                 // create output node
    );
  })

  // add listeners
  .on('cycle', function (event: any) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    assert.deepEqual(performantArrayToTreeOutput, expectedOutput)
    assert.deepEqual(unFlattenTreeOutput, expectedOutput)

    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });
