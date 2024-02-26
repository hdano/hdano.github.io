import json


def names_matched(name1, name2):
	#name1
	name1 = name1.lower().strip()
	name1_last = name1.split(' ')[-1].strip()
	name1_first = name1.split(f' {name1_last}')[0].strip()
	#name2
	name2 = name2.lower().strip()
	name2_last = name2.split(' ')[-1].strip()
	name2_first = name2.split(f' {name2_last}')[0].strip()
	return (name1_first in name2_first and name1_last in name2_last) or (name2_first in name1_first and name2_last in name1_last)

f = open('data.json', 'r')
alldata = json.loads(f.read())

f = open('4thgen.csv', 'r')
csv = f.read()

for idx, line in enumerate(csv.split('\n')):
	if idx < 1: continue
	data = line.split(',')
	gender = 'boys' if data[1] == "Men's Network" else 'girls'
	leader = data[2].strip()
	name = data[3].strip()
	# find leader
	primary_disciples = alldata[gender]['disciples']
	for list_type in ['main', 'extended']: 
		leader_matches = [(l['name'], i) for i, l in enumerate(primary_disciples[list_type]) if names_matched(leader, l['name'])]
		if len(leader_matches) > 0: break
	if len(leader_matches) == 0:
		print(f'Leader "{leader}" not found for "{name}"')
		continue
	leader_name, leader_idx = leader_matches[0]
	leader_list_type = list_type
	# find name
	disciples = primary_disciples[list_type][leader_idx]['disciples']
	for list_type in ['main', 'extended']: 
		name_matches = [(l['name'], i) for i, l in enumerate(disciples[list_type]) if names_matched(name, l['name'])]
		if len(name_matches) > 0: break
	if len(name_matches) == 0:
		print(f'Name "{name}" not found under "{leader_name}"')
		continue
	real_name, name_idx = name_matches[0]
	for d in range(12):
		d += 4
		if data[d].strip() != '':
			alldata[gender]['disciples'][leader_list_type][leader_idx]['disciples'][list_type][name_idx]['disciples']['main'].append({
				'name': data[d],
				'disciples': {'main':[],'extended':[]}
				})


f = open('data.json', 'w')
f.write(json.dumps(alldata))
