import esprima from 'esprima';
import ed from 'edit-distance';

export function calcTed(lastSourceCode, currentSourceCode) {

  const lastAst = esprima.parse(lastSourceCode);
  const currentAst = esprima.parse(currentSourceCode);
  let insert, remove, update;
  insert = remove = function(node) { return 1; };
  update = function(nodeA, nodeB) { 
    return nodeA.body.type !== nodeB.body.type ? 1 : 0;
  }
  let children = function(node) { return node.body; };

  const Ted = ed.ted(lastAst, currentAst, children, insert, remove, update);
  return Ted.distance;
}

