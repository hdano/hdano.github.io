var nodes = {}
var curnodeid = 0
var genterms = {
	'1': '1st',
	'2': '2nd',
	'3': '3rd',
	'4': '4th',
	'5': '5th',
	'6': '6th',
	'7': '7th',
	'8': '8th',
	'9': '9th',
	'10': '10th'
}

const init = () => {

	$.ajax({
		url: "data.json"
	}).done(function(data) {
		renderChart(data)
		addEventHandlers()
	});
}

$(document).ready(function(){
	init()
})

const renderChart = (node) => {
	curnodeid = 0
	$('#discipler-name').text(node.name)
	$('#degree1').text(genterms[`${node.generation}`])
	$('#degree2').text(genterms[`${node.generation + 1}`])
	$('#degree3').text(genterms[`${node.generation + 2}`])
	var htmlstr = ''
	if (node.parentkey) {
		htmlstr += drawParent(node.parentkey)
	} else {
		node['parentkey'] = ''
	}
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