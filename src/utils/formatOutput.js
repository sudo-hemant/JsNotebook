export function formatValue(item) {
  if (!item) return 'undefined';

  switch (item.type) {
    case 'undefined':
      return 'undefined';
    case 'null':
      return 'null';
    case 'function':
      return item.value;
    case 'symbol':
      return item.value;
    case 'error':
      return `${item.message}`;
    case 'unserializable':
      return item.value;
    case 'value':
      return formatJsonValue(item.value);
    default:
      return String(item);
  }
}

function formatJsonValue(value) {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return `[${value.map(formatJsonValue).join(', ')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([k, v]) => `${k}: ${formatJsonValue(v)}`)
      .join(', ');
    return `{ ${entries} }`;
  }
  return String(value);
}

export function formatConsoleArgs(args) {
  return args.map(formatValue).join(' ');
}
