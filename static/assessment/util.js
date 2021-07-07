const title = (str) => {
  return str.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
}

const ValueOr = (value,_or) => {
  if (!_or) _or = ''
  if (!value) value = _or
  return value
}

const boolUndefined = (value) => {
  return value==true?'Enabled':(value==false?'Disabled':'n/a')
}