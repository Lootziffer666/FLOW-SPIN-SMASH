/**
 * SPIN Node Graph — Offenes Wissensmodell für multimodale Stories
 *
 * Jede Information, die zur Entwicklung einer Story beiträgt, existiert
 * als Node: Figuren, Orte, Ereignisse, Objekte, Sinneseindrücke, Medien,
 * Motive, Regeln, Konzepte — und alles andere, was Sinn ergibt.
 *
 * Architektur-Prinzipien:
 * 1. Nodes sind NIE „voll belegt" — jeder Node ist offen für weitere
 *    Properties und Links.
 * 2. Links können jederzeit zwischen beliebigen Nodes entstehen —
 *    „Fäden spinnen".
 * 3. Links können Dokument- und Projektgrenzen überschreiten
 *    (SPIN ↔ FLOW ↔ LOOM ↔ SMASH).
 * 4. Der Graph wächst organisch — keine feste Struktur, kein Schema-Zwang.
 * 5. Typen sind offen — vordefinierte Typen als Orientierung, aber
 *    jeder beliebige Typ ist zulässig.
 */

export const NODE_TYPES = [
  'character', 'location', 'event', 'scene', 'object', 'dialogue',
  'chapter', 'arc', 'theme', 'motif', 'conflict',
  'sensation', 'medium', 'atmosphere', 'rhythm',
  'rule', 'lore', 'faction', 'system',
  'concept', 'reference', 'annotation', 'question',
];

export const LINK_TYPES = [
  'relates_to', 'causes', 'follows', 'contains', 'opposes',
  'transforms', 'references', 'depends_on', 'resembles',
  'belongs_to', 'inspires', 'contradicts',
];

let _counter = 0;

function generateId(prefix = 'n') {
  _counter += 1;
  const timestamp = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${rand}-${_counter}`;
}

export function createGraph(meta = {}) {
  return {
    id: generateId('g'),
    meta: {
      project: meta.project || 'SPIN',
      created: new Date().toISOString(),
      ...meta,
    },
    nodes: {},
    links: [],
  };
}

export function addNode(graph, spec) {
  const node = {
    id: spec.id || generateId('n'),
    type: spec.type || 'concept',
    label: spec.label || '',
    properties: { ...(spec.properties || {}) },
    source: spec.source || null,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  };
  graph.nodes[node.id] = node;
  return node;
}

export function getNode(graph, id) {
  return graph.nodes[id] || null;
}

export function setProperty(graph, nodeId, key, value) {
  const node = graph.nodes[nodeId];
  if (!node) return null;
  node.properties[key] = value;
  node.modified = new Date().toISOString();
  return node;
}

export function removeNode(graph, nodeId) {
  if (!graph.nodes[nodeId]) return false;
  delete graph.nodes[nodeId];
  graph.links = graph.links.filter(
    l => l.source !== nodeId && l.target !== nodeId
  );
  return true;
}

export function link(graph, sourceId, targetId, spec = {}) {
  const l = {
    id: generateId('l'),
    source: sourceId,
    target: targetId,
    type: spec.type || 'relates_to',
    label: spec.label || '',
    bidirectional: spec.bidirectional || false,
    properties: { ...(spec.properties || {}) },
    created: new Date().toISOString(),
  };
  graph.links.push(l);
  return l;
}

export function getLinks(graph, nodeId) {
  return graph.links.filter(
    l => l.source === nodeId || l.target === nodeId
  );
}

export function removeLink(graph, linkId) {
  const before = graph.links.length;
  graph.links = graph.links.filter(l => l.id !== linkId);
  return graph.links.length < before;
}

export function findNodes(graph, filter = {}) {
  let nodes = Object.values(graph.nodes);
  if (filter.type) nodes = nodes.filter(n => n.type === filter.type);
  if (filter.label) {
    const lower = filter.label.toLowerCase();
    nodes = nodes.filter(n => n.label.toLowerCase().includes(lower));
  }
  if (filter.project) nodes = nodes.filter(n => n.source && n.source.project === filter.project);
  if (filter.predicate) nodes = nodes.filter(filter.predicate);
  return nodes;
}

export function getNeighbors(graph, nodeId) {
  const neighbors = [];
  for (const l of graph.links) {
    if (l.source === nodeId) {
      const target = graph.nodes[l.target];
      if (target) neighbors.push({ node: target, link: l, direction: l.bidirectional ? 'both' : 'outgoing' });
    }
    if (l.target === nodeId) {
      const source = graph.nodes[l.source];
      if (source) neighbors.push({ node: source, link: l, direction: l.bidirectional ? 'both' : 'incoming' });
    }
  }
  return neighbors;
}

export function exportGraph(graph) {
  return {
    version: '0.1.0',
    type: 'spin-graph',
    id: graph.id,
    meta: { ...graph.meta },
    nodes: Object.values(graph.nodes).map(n => ({ ...n, properties: { ...n.properties } })),
    links: graph.links.map(l => ({ ...l, properties: { ...l.properties } })),
  };
}

export function importGraph(data) {
  const graph = {
    id: data.id || generateId('g'),
    meta: { ...data.meta },
    nodes: {},
    links: (data.links || []).map(l => ({ ...l, properties: { ...(l.properties || {}) } })),
  };
  for (const n of (data.nodes || [])) {
    graph.nodes[n.id] = { ...n, properties: { ...(n.properties || {}) } };
  }
  return graph;
}

export function mergeGraph(target, source, prefix = '') {
  const nodeMap = {};
  let imported = 0;
  for (const node of Object.values(source.nodes)) {
    const newId = prefix ? `${prefix}:${node.id}` : node.id;
    if (!target.nodes[newId]) {
      target.nodes[newId] = {
        ...node,
        id: newId,
        properties: { ...node.properties },
        source: node.source || { project: source.meta.project || 'unknown' },
      };
      imported++;
    }
    nodeMap[node.id] = newId;
  }
  for (const l of source.links) {
    const newSource = nodeMap[l.source] || l.source;
    const newTarget = nodeMap[l.target] || l.target;
    target.links.push({
      ...l,
      id: generateId('l'),
      source: newSource,
      target: newTarget,
      properties: { ...l.properties },
    });
  }
  return { nodeMap, imported };
}
