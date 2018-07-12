function createCursor(node, params) {
  return Buffer.from(JSON.stringify({ id: node.id, ...params })).toString('base64')
}

export default createCursor
