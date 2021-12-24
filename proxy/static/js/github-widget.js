// NOTE: github api
(d => {
  const defaultProfileData = '{"login":"eduardobc88","id":4595695,"node_id":"MDQ6VXNlcjQ1OTU2OTU=","avatar_url":"https://avatars.githubusercontent.com/u/4595695?v=4","gravatar_id":"","url":"https://api.github.com/users/eduardobc88","html_url":"https://github.com/eduardobc88","followers_url":"https://api.github.com/users/eduardobc88/followers","following_url":"https://api.github.com/users/eduardobc88/following{/other_user}","gists_url":"https://api.github.com/users/eduardobc88/gists{/gist_id}","starred_url":"https://api.github.com/users/eduardobc88/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/eduardobc88/subscriptions","organizations_url":"https://api.github.com/users/eduardobc88/orgs","repos_url":"https://api.github.com/users/eduardobc88/repos","events_url":"https://api.github.com/users/eduardobc88/events{/privacy}","received_events_url":"https://api.github.com/users/eduardobc88/received_events","type":"User","site_admin":false,"name":"Eduardo Beltran Carbajal","company":null,"blog":"https://about.me/eduardobeltranc","location":"Morelia Michoacán, México","email":null,"hireable":true,"bio":"$npx eduardobc88\\r\\n🇲🇽","twitter_username":"eduardobc88","public_repos":17,"public_gists":18,"followers":6,"following":19,"created_at":"2013-06-02T23:13:21Z","updated_at":"2021-12-14T18:40:37Z","_timestamp":1639528992377}'


  let baseurl = 'https://api.github.com/', i

  const store = (key, value) => {
    try {
      if (window.localStorage) {
        if (value) {
          value._timestamp = new Date().valueOf()
          localStorage[key] = JSON.stringify(value)
        } else {
          var ret = localStorage[key]
          if (ret)
            return JSON.parse(ret)

          return null
        }
      }
    } catch(e) {}
  }

  const querystring = () => {
    let href = window.location.href, kv
    let params = href.slice(href.indexOf('?') + 1).split('&')
    let qs = [];

    for (i = 0; i < params.length; i++) {
      kv = params[i].split('=')
      qs.push(kv[0])
      qs[kv[0]] = kv[1]
    }
    return qs
  }

  let qs = querystring()

  const request = url => {
    return new Promise((resolve, reject) => {
      if (defaultProfileData !== '') {
        resolve(JSON.parse(defaultProfileData))
        return
      }
      let cache = store(url)
      if (cache) {
        resolve(cache)
        return
      }
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.onload = () => {
        let status = xhr.status
        if (status == 200) {
          store(url, JSON.parse(xhr.response))
          resolve(JSON.parse(xhr.response))
        } else
          reject({
            error: status,
          })
      }
      xhr.send()
    })
  }




  // NOTE: widget
  const widgetStyle = `
    background-color: #fff;
    border-radius: 20px;
    border: 1px solid #ddd;
    color: #333333;
    display: inline-flex;
    margin: 4px;
    max-width: 175px;
    padding: 4px;
    text-decoration: none;
  `
  const widgetLeftStyle = `
    display: flex;
  `
  const widgetRightStyle = `
    align-items: center;
    display: grid;
    grid-template-rows: 1fr 1fr;
    padding: 0 4px;
  `
  const widgetAvatarStyle = `
    border-radius: 100%;
    height: 28px;
    margin: auto;
    overflow: hidden;
    width: 28px;
  `
  const widgetNameStyle = `
    font-weight: bold;
    font-size: 11px;
    line-height: 1;
    margin: 0;
  `
  const widgetLoginStyle = `
    font-weight: normal;
    font-size: 11px;
    line-height: 1;
    margin: 0;
  `
  const widgetBioStyle = `
    font-weight: normal;
    font-size: 11px;
    line-height: 1;
    margin: 0;
  `

  let count = 0
  let client_url, client_id, client_secret, client_theme

  const queryclass = name => {
    if (d.querySelectorAll)
      return d.querySelectorAll('.' + name)

    let elements = d.getElementsByTagName('div')
    let ret = []
    for (i = 0; i < elements.length; i++)
      if (~elements[i].className.split(' ').indexOf(name))
        ret.push(elements[i])
    return ret
  }

  const querydata = (element, name) => {
    return element.getAttribute('data-' + name)
  }

  const render = async (widgetEl, widgetURL) => {
    let user = querydata(widgetEl, 'user')
    let github = querydata(widgetEl, 'github')
    if (github) {
      github = github.split('/')
      if (github.length && !user)
        user = github[0]
    }
    if (!user)
      return

    count += 1
    let identity = 'ghwidget-' + user + '-' + count
    let userGitHubURLAPI = `${ baseurl }users/${ github }`
    // NOTE: request github api
    let ghUserData = await request(userGitHubURLAPI)
    if (ghUserData.error !== undefined)
      return

    // NOTE: create wrapper
    let widget = d.createElement('a')
    widget.setAttribute('id', identity)
    widget.setAttribute('href', ghUserData.html_url)
    widget.setAttribute('style', widgetStyle)
    widget.setAttribute('target', '_blank')
    // NOTE: create blocks
    let leftWrapper = d.createElement('div')
    leftWrapper.setAttribute('style', widgetLeftStyle)
    widget.appendChild(leftWrapper)
    let rightWrapper = d.createElement('div')
    rightWrapper.setAttribute('style', widgetRightStyle)
    widget.appendChild(rightWrapper)
    // NOTE: create avatar
    let avatar = d.createElement('img')
    avatar.setAttribute('src', ghUserData.avatar_url)
    avatar.setAttribute('style', widgetAvatarStyle)
    leftWrapper.appendChild(avatar)
    // NOTE: name
    let name = d.createElement('p')
    name.innerHTML = ghUserData.name
    name.setAttribute('style', widgetNameStyle)
    rightWrapper.appendChild(name)
    // // NOTE: login
    // let login = d.createElement('p')
    // login.innerHTML = ghUserData.login
    // login.setAttribute('style', widgetLoginStyle)
    // rightWrapper.appendChild(login)
    // NOTE: bio
    let bio = d.createElement('p')
    bio.innerHTML = ghUserData.bio
    bio.setAttribute('style', widgetBioStyle)
    rightWrapper.appendChild(bio)

    widgetEl.parentNode.replaceChild(widget, widgetEl)
    return widget
  }

  let cards = queryclass('github-widget')
  for (i = 0; i < cards.length; i++) {
    render(cards[i])
  }

  if (window.githubWidget) {
    window.githubWidget.render = render
  }

})(document)
