
function initWebpages() {
    //remove staff for non-staff
    if(!document.querySelector('body').classList.contains('g-4')) {
        document.querySelectorAll('.staffOnly').forEach(item => item.remove());
    }

    //remove loading screen
    document.querySelector('body').classList.remove('loading');
    document.querySelector('#loading').remove();
    initTabs(true, '.webpage', '.webpage--menu', '.webpage--content', 'is-active', '.tab-category', ['.webpage--menu .accordion--trigger', '.webpage--menu .accordion--content', '.webpage--menu .accordion--content a', '.webpage--content .tab-category', '.webpage--content .tab-category tag-tab']);

    //accordions
    initAccordion();
}
function toggleWebpageMenu(e) {
    e.closest('.webpage--menu').classList.toggle('is-open');
}
function reloadForm(e) {
	location.reload();
}
function sendDiscordMessage(webhook, embedTitle, message, notification = null, color = null) {
    const request = new XMLHttpRequest();
    request.open("POST", webhook);

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
        "content": notification,
        "embeds": [
            {
            "title": embedTitle,
            "description": message,
            "color": parseInt(color, 16)
            }
        ],
        "attachments": []
	};

    request.send(JSON.stringify(params));
}
function sendAjax(form, data, successMessage, staffDiscord, publicDiscord) {
    $(form).trigger('reset');
    
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        success: function () {
            console.log('success');
            if(staffDiscord) {
                sendDiscordMessage(`https://discord.com/api/webhooks/${staffDiscord.hook}`, staffDiscord.title, staffDiscord.text);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            form.innerHTML = `Whoops! The sheet connection didn't quite work. Please refresh the page and try again! If this persists, please open the console (ctrl + shift + J) and send Lux a screenshot of what's there.`;
        },
        complete: function () {
            form.querySelector('button[type="submit"]').innerText = `Submit`;
            
            form.innerHTML = successMessage;

            window.scrollTo(0, 0);
            
            console.log('complete');
            if(publicDiscord) {
                sendDiscordMessage(`https://discord.com/api/webhooks/${publicDiscord.hook}`, publicDiscord.title, publicDiscord.text);
            }
        }
    });
}