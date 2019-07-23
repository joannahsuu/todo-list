let sendBtn = document.getElementById('sendBtn')
let content = document.getElementById('content')
let contentLth = document.getElementById('listNum')
let list = document.getElementById('list')

sendBtn.addEventListener('click', function(e) {
  let str = content.value
  // console.log('str', str)
  if (str.trim() === '') {
    alert('輸入內容不得為空')
    return
  }
  // ajax
  let xhr = new XMLHttpRequest()
  xhr.open('post', '/addTodo')
  xhr.setRequestHeader('Content-type', 'application/json')
  let todo = JSON.stringify({ 'content': str })
  xhr.send(todo)
  xhr.onload = function() {
    let data = JSON.parse(xhr.responseText)
    // console.log('data', data)
    if(!data.success) {
      alert(data.msg)
      return
    }
    let { result } = data
    let liStr = ''
    for(item in result) {
      liStr += `
      <li>
        <span>${result[item].content}</span>
        <img src="/img/remove.png" data-id="${item}" />
      </li>`
    }
    list.innerHTML = liStr
    if(!Object.keys(result).length) {
      contentLth.innerHTML = 0
    }
    contentLth.innerHTML = Object.keys(result).length
    content.value = ''
  }
})

list.addEventListener('click', function(e) {
  if(e.target.nodeName != 'IMG') {
    return
  }
  let tid = e.target.dataset.id
  // ajax
  let xhr = new XMLHttpRequest()
  xhr.open('post', '/removeTodo')
  xhr.setRequestHeader('Content-type', 'application/json')
  let removeTodo = JSON.stringify({'id': tid})
  xhr.send(removeTodo)
  xhr.onload = function() {
    let data = JSON.parse(xhr.responseText)
    // console.log('data', data)
    if(!data.success) {
      alert(data.msg)
      return
    }
    let { result } = data
    let liStr = ''
    for(item in result) {
      liStr += `
      <li>
        <span>${result[item].content}</span>
        <img src="/img/remove.png" data-id="${item}" />
      </li>`
    }
    list.innerHTML = liStr
    if(!Object.keys(result).length) {
      contentLth.innerHTML = 0
    }
    contentLth.innerHTML = Object.keys(result).length
    content.value = ''
  }
})