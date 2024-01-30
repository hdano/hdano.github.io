var gender = "boys"
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

	$.ajax({
		url: `data.json?t=${new Date().getTime()}`
	}).done(function(data) {
		renderChart(data[gender])
		addEventHandlers()
	});
}

$(document).ready(function(){
	init()

	$('#gender-switch .gender-boys').on('click', function(){
		gender = 'boys'
		$('#gender-switch span').attr('data-on', 'no')
		$(this).attr('data-on', 'yes')
		init()
	})
	$('#gender-switch .gender-girls').on('click', function(){
		gender = 'girls'
		$('#gender-switch span').attr('data-on', 'no')
		$(this).attr('data-on', 'yes')
		init()
	})
})

const updateDegreeTexts = (generation) => {
	$('#degree1').text(genterms[`gen${generation}`])
	$('#degree2').text(genterms[`gen${generation + 1}`])
	$('#degree3').text(genterms[`gen${generation + 2}`])
}

const renderChart = (node) => {
	curnodeid = 0
	$('#discipler-name').text(node.name)
	var htmlstr = ''
	if (node.parentkey) {
		htmlstr += drawParent(node.parentkey)
	} else {
		node['parentkey'] = ''
	}
	updateDegreeTexts(node.generation || 1)
	htmlstr += drawDisciple(node, node.parentkey, 0)
	$('#wrapper').hide().html(htmlstr).fadeIn()
}

const drawParent = (parentkey) => {
	var node = nodes[parentkey]
	return `<span class="label parent gen${node.generation}" data-key="${parentkey}">${node.name}<span class="tag">discipler</span></span>`
}

const drawDisciple = (node, parentkey, level) => {
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
	if (level > 0) html += '<div class="entry">'
	html += `<span class="label gen${node.generation}" data-key="${nodekey}">${node.name}</span>`
	curnodeid++
	if (node.disciples.length > 0) {
		level++
		html += `<div class="branch lvl${level}">`
		if (level >= 2) {
			html += drawL3Disciples(node.disciples, nodekey, 0)	
		} else {
			node.disciples.map((disciple) => {
				html += drawDisciple(disciple, nodekey, level)
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
		const nodekey = $(this).attr('data-key')
		renderChart(nodes[nodekey])
		addEventHandlers()
	})
}