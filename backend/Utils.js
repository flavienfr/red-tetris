export function FormValidation(pseudo, room){
  let myRegEx  = /^[a-z0-9]+$/i
  let erro_msg = 'Only alphanumeric characters allowed.'

  if (!(myRegEx.test(pseudo)) || !(myRegEx.test(room)))
    return (erro_msg)
  return null
}