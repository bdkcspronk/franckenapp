// Small utility to expand simple slash-commands used in committee text fields.
// Current rules:
//  - /AP<Name> -> "this will be an AP for <Name>"
// Add more patterns here as needed.

export function expandShortCommands(input) {
  if (!input || typeof input !== 'string') return input;

  // Expand /AP<Name>
  const expanded = input.replace(/\/AP([A-Za-z0-9_\-]+)/g, (_m, name) => {
    // Normalize name (keep as-is, but replace underscores/hyphens with space)
    const pretty = String(name).replace(/[_\-]+/g, ' ');
    return `this will be an AP for ${pretty}`;
  });

  return expanded;
}

export default expandShortCommands;
