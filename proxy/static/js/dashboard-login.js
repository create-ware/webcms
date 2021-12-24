let loginFormEl = null

let lastNameHintEl = null
let nameHintEl = null
let passHintEl = null
let emailHintEl = null

let firstNameErrorEl = null
let lastNameErrorEl = null
let nameErrorEl = null
let passErrorEl = null
let emailErrorEl = null


const onInputFocus = el => {
  if (el.value)
    el.classList.add('no-empty');
  el.classList.toggle('active');
}

const validateEmail = email => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    return true

  return false
}

const reset = () => {
  nameHintEl.style = 'display: block'
  passHintEl.style = 'display: block'

  nameErrorEl.innerText = ''
  passErrorEl.innerText = ''
}

let onSubmit = e => {
  let passed = true

  let name = document.getElementById('user_name').value
  let pass = document.getElementById('user_pass').value

  reset()

  if (name === '') {
    passed = false
    nameHintEl.style = 'display: none'
    nameErrorEl.innerText = 'Requerido'
  }
  if (pass === '') {
    passed = false
    passHintEl.style = 'display: none'
    passErrorEl.innerText = 'Requerido'
  }
  if (!passed && e !== undefined)
    e.preventDefault()
}


const onKeyup = el => {
  if (el.target.id === 'user_name') {
    nameHintEl.style = 'display: block'
    nameErrorEl.innerText = ''
    if (el.target.value === '') {
      nameHintEl.style = 'display: none'
      nameErrorEl.innerText = 'Requerido'
    }
  } else if (el.target.id === 'user_pass') {
    passHintEl.style = 'display: block'
    passErrorEl.innerText = ''
    if (el.target.value === '') {
      passHintEl.style = 'display: none'
      passErrorEl.innerText = 'Requerido'
    }
  }
}


window.addEventListener('load', e => {
  loginFormEl = document.getElementById('login-form')

  nameHintEl = document.getElementById('user_name_hint')
  passHintEl = document.getElementById('user_pass_hint')

  nameErrorEl = document.getElementById('user_name_error')
  passErrorEl = document.getElementById('user_pass_error')

  let nameEl = document.getElementById('user_name')
  let passEl = document.getElementById('user_pass')

  nameEl.addEventListener('keyup', onKeyup, true)
  passEl.addEventListener('keyup', onKeyup, true)

  loginFormEl.addEventListener('submit', onSubmit, true)
})
