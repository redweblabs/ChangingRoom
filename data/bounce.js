var rawDivGrab = document.querySelectorAll("[href]"),
	navDivs = [],
	keyword = "men",
	zz = rawDivGrab.length,
	start = Date.now() * 1;

self.port.on("message", function(data) {

	data = JSON.parse(data);

	keyword = data[0];

	data = JSON.parse(data[1]);

	if(window.location.origin + "/" !== window.location.href){
		console.log("This is not the home page");
	}

	var xv = data.length,
		instances = [];

	while(xv > 0){

		if(data[xv - 1].indexOf(window.location.origin) > -1){
		
			instances.push(data[xv - 1]);
		
		}

		xv -= 1;
	
	}

	if(instances.length > 1){
		console.log("Person is browsing, Don't redirect");
		return;
	} else if(instances.length == 1){

		var potentials = [];

		while(zz > 0){

			var thisDiv = rawDivGrab[zz - 1],
				parents = [];

				while(thisDiv){

					parents.unshift(thisDiv);

					if(thisDiv.getAttribute){

						if(thisDiv.getAttribute('href') !== null){

							if(thisDiv.getAttribute('href').toLowerCase().indexOf(keyword) != -1 && thisDiv.getAttribute('href').toLowerCase().indexOf(window.location.origin) > -1){
							
								potentials.push({
									node : thisDiv,
									parents : parents
								});

							}	

						}

					}

					thisDiv = thisDiv.parentNode;

				}

			zz -= 1;

		}

		var refined = [],
			x = potentials.length;

		while(x > 0){

			var thisPotential = potentials[x - 1],
				distance = 0,
				parentAdded = false,
				y = thisPotential.parents.length;

			while(y > 0){

				var thisPotentialParent = thisPotential.parents[y - 1],
					hasId = hasClass = hasTitle = false;

				if(thisPotentialParent.getAttribute){

					if(thisPotentialParent.getAttribute('id') !== null){

						if(thisPotentialParent.getAttribute('id').indexOf('Nav') > -1|| thisPotentialParent.getAttribute('id').indexOf('nav') > -1){
							parentAdded = true
							refined.push(thisPotential);
							break;
						}
						
					} 

					if(thisPotentialParent.getAttribute('class') !== null){

						if(thisPotentialParent.getAttribute('class').indexOf('Nav') > -1|| thisPotentialParent.getAttribute('class').indexOf('nav') > -1){
							parentAdded = true
							refined.push(thisPotential);
							break
						}
					}

					if(thisPotentialParent.getAttribute('title') !== null){

						if(thisPotentialParent.getAttribute('title').indexOf('Nav') > -1|| thisPotentialParent.getAttribute('title').indexOf('nav') > -1){
							parentAdded = true
							refined.push(thisPotential);
							break
						}
					}


				}

				distance += 1;

				y -= 1;

			}

			x -= 1;

		}

		var distanceLinks = [];

		for(var z = 0; z < refined.length; z += 1){

			var thisLink = refined[z],
				rootURL = thisLink.node.baseURI,
				origHref = thisLink.node.href.replace(thisLink.node.search, '');

				thisLink.node.href = thisLink.node.href.toLowerCase();

				distanceLinks.push({
					distance : thisLink.node.href.indexOf(keyword) - thisLink.node.baseURI.length,
					link : origHref,
					after : thisLink.node.href.substring(thisLink.node.href.indexOf(keyword) + keyword.length, thisLink.node.href.length - 1),
					original : origHref
				});

		}

		distanceLinks.sort(function(a,b) {
			
			if (a.after.length < b.after.length){
				return -1;
			} else if (a.after.length > b.after.length){
				return 1;
			} else {
				return 0;
			}
			
		});

		distanceLinks.sort(function(a,b) {
			
			if (a.distance < b.distance){
				return -1;
			} else if (a.distance > b.distance){
				return 1;	
			} else {
				return 0;
			}
		
		});

		if(distanceLinks.length > 0){

			var oi = 0;

			while(oi < distanceLinks.length){

				if(distanceLinks[oi].link.indexOf('rss') == -1 && distanceLinks[oi].link.indexOf('ment') == -1){

					(function(oi){

						var cleanString = distanceLinks[oi].link.replace(window.location.origin, '')
							cleanString.replace(distanceLinks[oi].after, "");
							cleanString = cleanString.substr(cleanString.toLowerCase().indexOf(keyword));

						if(cleanString.length >= keyword.length && levenshtein.compare(cleanString, keyword) < 10){
							
							window.location.href = distanceLinks[oi].link;
						
						} else if(distanceLinks[oi].distance < 5){

							window.location.href = distanceLinks[oi].link;
						
						}
						
					})(oi);
					
					return;

				}

				oi += 1;

			}

		}

	}

});