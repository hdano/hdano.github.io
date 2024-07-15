const getParams = () => {
  var params = {}
  window.location.search.substring(1).split('&').map((x) => {
    a = x.split('=');
    params[a[0]] = a[1]
  })
  return params
}

const updateLabels = () => {
  var user_title = `${USER.level} ${USER.instrument} ${USER.role}`
  $('head title').text(`AHCCI SOM Resources - ${user_title}`)
  $('body').addClass(user_title)  
  $('.fill-title').text(user_title)
  $('.fill-role').text(USER.role)
  $('.fill-instrument').text(USER.instrument)
  $('.fill-level').text(USER.level)
  var role_activities = {'student': 'studying', 'teacher': 'teaching'}
  var role_actions = {'student': 'learn', 'teacher': 'teach'}
  $('.fill-role-activity').text(role_activities[USER.role])
  $('.fill-role-action').text(role_actions[USER.role])
}

const gotoContent = (name) => {
    $('.content').hide()
    $(`#content-${name}`).fadeIn('fast')
    menu_name = name.indexOf('manual') > -1 ? 'manuals' : name
    $('.nav-link').removeClass('active')
    $(`.nav-link.link-${menu_name}`).addClass('active')
    $('.nav-link .current').removeClass('visually-hidden').addClass('hidden').text('')
    $(`.nav-link.link-${menu_name} .current`).removeClass('hidden').addClass('visually-hidden').text('(current)')
}

const activateLinks = () => {
  $('.link-home').click(function(e){gotoContent('home')})
  $('.link-manuals').click(function(e){gotoContent('manuals')})
  $('.link-guidebook').click(function(e){gotoContent('guidebook')})
  $('.link-about').click(function(e){gotoContent('about')})
  $('.link-manual').click(function(e){
    loadManualContents($(this).attr('data-manual'))
    gotoContent('manual')
  })
}

const loadManualContents = (manual) => {
  let manual_name = manual === 'instrument' ? USER.instrument : 'Music Theory'
  manual = manual === 'instrument' ? USER.instrument : 'theory'
  $('.fill-manual').text(manual_name)
  $('#content-manual .manual-content').each(function(){
    $(this).html('')
    let content = $(this).attr('data-content')
    let url = `manuals/${USER.level}/${manual}/${content}.html`
    $.get(url, (html) => {
      $(this).html(html)
    })
  })
}

const init = () => {
  $('.content').hide()
  $('#content-home').fadeIn('fast')
}

$(document).ready(function(){
  updateLabels()
  activateLinks()
  init()
})

var USER = getParams()