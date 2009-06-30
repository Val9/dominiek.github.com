var study = {
  
	templates: {
		
		flipside: function(side) {

			var part = iknow.session.item[side];
			var html = '<div style="'+(side=="response" ? "display:none;":"")+'" class="item-card-inner-'+side+' cue-'+part.type+'-quiz"><div class="item-'+side+'">';
				
				if(part.content.sound)
					html += '<span class="'+side+'-audio"><a href="'+part.content.sound+'" class="fg-button ui-state-default ui-corner-all">play</a></span>';
				
				if(part.type == '' || part.content.text)
					html += iknow.getTextMarkup(part);
				
				if(part.content.image) {
					
					var data = smart.session.preloaded[part.content.image];
					data = { height: data.height, width: data.width };
					var style = '';
					
					// resize image
					var prop = data.width >= data.height ? 'width' : 'height';
					if(data[prop] > iknow.alignments.study[prop]) { //TODO: get dynamic parent height
						data[prop] = iknow.alignments.study[prop];
						data[prop == 'height' ? 'width' : 'height'] = data[prop == 'height' ? 'width' : 'height'] * (data[prop] / smart.session.preloaded[part.content.image][prop]);
						style += prop + ':' + data[prop] + 'px;';
					}	
						
					// center image
					style += 'top: ' + (iknow.alignments.study.height - data.height)/2 + 'px;';
					style += 'left: ' + (iknow.alignments.study.width - data.width)/2 + 'px;';				
					
					html += '<span class="'+side+'-image"><img style="'+style+'" src="'+part.content.image+'"></span>';
					
				}
			html += '</div></div>';
			
			return html;
			
		}
		
	},
	
	populateStudyTab: function() {

		// fill the study tab
		$("#item-card")
			.css('visibility', 'hidden')
			.html(study.templates.flipside('response') + study.templates.flipside('cue'));
		
		
		//Fly over animation for studying
		var item = iknow.session.item;
		$('div.flyover').remove();
		$('<div class="flyover">'+(item.cue.type == 'image' ? '<img src="'+item.cue.content.image+'">' : iknow.getTextMarkup(item.cue))+'</div>')
			.css({ top: '50%', left: '10%', marginTop: '-1em', opacity: 0 })
			.appendTo($("#item-card").parent())
			.animate({ left: '50%', opacity: 1 }, { duration: 1000, easing: 'easeOutExpo' })
			.animate({ left: '90%', opacity: 0 }, { duration: 1000, easing: 'easeInExpo', complete: function() {
				
				$(this)
					.clone().appendTo(this.parentNode)
					.html((item.response.type == 'image' ? '<img src="'+item.response.content.image+'">' : iknow.getTextMarkup(item.response)))
					.css({ left: '10%', opacity: 0 })
					.animate({ left: '50%', opacity: 1 }, { duration: 1000, easing: 'easeOutExpo' })
					.animate({ left: '90%', opacity: 0 }, { duration: 1000, easing: 'easeInExpo', complete: function() {
					
						$('div.flyover:eq(1)')
							.css({ left: '10%', marginTop: '1em' })
							.animate({ left: '50%', opacity: 1 }, { duration: 1000, easing: 'easeOutExpo' })
							
						$('div.flyover:eq(0)')
							.css({ marginTop: '-2em' })
							.animate({ left: '50%', opacity: 1 }, { duration: 1000, easing: 'easeOutExpo', complete: function() {
								
								$('div.flyover').animate({ opacity: 0 }, 1000, function() { $(this).remove(); });
								
								$('#item-card')
									.css({ opacity: 0, visibility: 'visible' })
									.animate({ opacity: 1 }, 1000);
								
							} });
							
						
					}
					});
			
			}
			});
		
	},
	
	populateSentencesTab: function() {
		
		var sentences = iknow.session.item.cue.related.sentences;
		
		//If there aren't any sentences, hide the sentence tab
		if(!sentences)
			return $('#tabs').tabs('disable', 1);
			
		$('#tabs').tabs('enable', 1);
		
		//TODO: Fill sentences here
		
	},
	
	populateExtraInfoTab: function() {
		
		// Always disable the extra tab
		if(false)
			return $('#tabs').tabs('disable', 2);
		
		//TODO: Fill with content
		$('#tabs').tabs('enable', 2);
		
	},
	
	populateQuizPracticeTab: function() {
		//TODO
	},
	
	populate: function() {
		
		// We strangely need to relcalculate the width/height of the alignment container upon first show
		if($('#calculate-study').length) {
			var s = $('#calculate-study');
			study.container.css('visibility', 'hidden').show();
			iknow.alignments.study = { width: s[0].offsetWidth, height: s[0].offsetHeight };
			study.container.hide().css('visibility', 'visible');
		}
		
		study.populateStudyTab();
		study.populateSentencesTab();
		study.populateExtraInfoTab();
		study.populateQuizPracticeTab();
		
		study.container.show();
		$('#tabs').tabs('select', 0);
		
		$('div.session-footer-panel div.right-button').find("a").text('Next').end().show().find('a').delayedFocus();
		
	}
	
};

$(document).ready(function() {
	
	// initialize tabs for study screen
	$("#tabs").tabs({
		select: function(e, ui) {
			if(ui.index == 2) {
				$('div.extra-info').delayedFocus();
			}
		}
	});
	
	// find and cache container
	study.container = $("div.study-panel");
		
});