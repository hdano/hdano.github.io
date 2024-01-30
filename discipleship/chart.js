var current_gender = "boys"
var current_list = "main"
var current_nodekey = ""
var nodes = {}
var curnodeid = 0
var genterms = {
	'gen1': '1st',
	'gen2': '2nd',
	'gen3': '3rd',
	'gen4': '4th',
	'gen5': '5th',
	'gen6': '6th',
	'gen7': '7th',
	'gen8': '8th',
	'gen9': '9th',
	'gen10': '10th'
}

const init = () => {

	curnodeid = 0

	$.ajax({
		url: `data.json?t=${new Date().getTime()}`
	}).done(function(data) {
		render(data[current_gender])
	});

	switchList('main')
}

$(document).ready(function(){
	init()

	$('#gender-switch .gender-boys').on('click', function(){
		switchGender('boys', this)
	})
	$('#gender-switch .gender-girls').on('click', function(){
		switchGender('girls', this)
	})
	$('#list-switch .list-main').on('click', function(){
		switchList('main')
		render(nodes[current_nodekey])
	})
	$('#list-switch .list-extended').on('click', function(){
		switchList('extended')
		render(nodes[current_nodekey])
	})
})

const switchGender = (gender, el) => {
	current_gender = gender
	$('#gender-switch span').attr('data-on', 'no')
	$(el).attr('data-on', 'yes')
	init()
}

const render = (node) => {
	renderChart(node)
	addEventHandlers()
}

const switchList = (list) => {
	current_list = list
	$('#list-switch').attr('data-list', current_list)
}

const updateDegreeTexts = (generation) => {
	$('#degree1').text(genterms[`gen${generation}`])
	$('#degree2').text(genterms[`gen${generation + 1}`])
	$('#degree3').text(genterms[`gen${generation + 2}`])
}

const renderChart = (node) => {
	current_nodekey = node.key || 'node-0'
	$('#discipler-name').text(node.name)
	var htmlstr = ''
	if (node.parentkey) {
		htmlstr += drawParent(node.parentkey)
	} else {
		node['parentkey'] = ''
	}
	htmlstr += drawDisciple(node, node.parentkey, 0, 0)
	$('#wrapper').hide().html(htmlstr).fadeIn()
	updateDegreeTexts(node.generation || 1)
	$('#list-switch').hide()
	if (current_list === 'extended' || (current_list === 'main' && node.disciples.extended.length > 0)) {
		$('#list-switch').show()
	}
}

const drawParent = (parentkey) => {
	var node = nodes[parentkey]
	return `<span class="label parent gen${node.generation}" data-key="${parentkey}">${node.name}<span class="tag">discipler</span></span>`
}

const drawDisciple = (node, parentkey, level, total_siblings) => {
	var nodekey = ''
	if (!node.key) {
		node['parentkey'] = parentkey
		nodekey = `node-${curnodeid}`
		node['key'] = nodekey
		node['generation'] = level + 1
		nodes[nodekey] = node
	} else {
		nodekey = node.key
	}
	var html = ''
	if (level > 0) {
		if (total_siblings === 1) {
			html += '<div class="entry sole">'
		} else {
			html += '<div class="entry">'
		}
	}
	html += `<span class="label gen${node.generation}" data-key="${nodekey}">${node.name}</span>`
	curnodeid++
	var list = current_list
	if (level > 0) {
		list = 'main'
	}
	if (node.disciples[list].length > 0) {
		level++
		html += `<div class="branch lvl${level}">`
		if (level >= 2) {
			html += drawL3Disciples(node.disciples[list], nodekey, 0)	
		} else {
			node.disciples[list].map((disciple) => {
				html += drawDisciple(disciple, nodekey, level, node.disciples[list].length)
			})
		}
		html += '</div>'
	}
	if (level > 0) html += '</div>'
	return html
}

const drawL3Disciples = (disciples, parentkey, idx) => {
	var node = disciples[idx] 
	var nodekey = ''
	if (!node.key) {
		node['parentkey'] = parentkey
		nodekey = `node-${curnodeid}`
		node['key'] = nodekey
		node['generation'] = nodes[parentkey].generation + 1
		nodes[nodekey] = node
	} else {
		nodekey = node.key
	}
	var html = '<div class="entry sole">'
	html += `<span class="label gen${node.generation}" data-key="${nodekey}">${node.name}</span>`
	curnodeid++
	idx++
	if (idx < disciples.length) {
		html += `<div class="branch lvl2">${drawL3Disciples(disciples, parentkey, idx)}</div>`
	}
	html += '</div>'
	return html
}

const addEventHandlers = () => {
	$('.label').off('click').on('click', function() {
		switchList('main')
		render(nodes[$(this).attr('data-key')])
	})
}