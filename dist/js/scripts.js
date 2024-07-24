/********** Global **********/
let pageType = document.querySelector('body').id;
let pageClasses = document.querySelector('body').classList;

//click to change subaccounts
document.querySelectorAll('#post_as_menu option').forEach(account => {
    account.innerHTML = account.innerHTML.replace(/&nbsp;&nbsp;»/g,'');
});
let switcher = document.querySelector('#account-switch #subaccounts_menu select');
if(switcher !== null) {
    document.querySelectorAll('select[name="sub_id"] option').forEach(account => {
        account.innerHTML = account.innerHTML.replace(/&nbsp;&nbsp;»/g,'');
    });
    initSwitcher();
}

//remove empty tooltips
$('*[title=""]').removeAttr('title');
$('*[tooltip=""]').removeAttr('tooltip');
if (typeof tippy === 'function') {
    tippy(document.querySelectorAll('[title]'), {
        content: (reference) => {
	    function htmlDecode(input){
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	    }
	    if(!reference.querySelector('.macro--button')) {
                const title = reference.getAttribute('title');
                reference.removeAttribute('title');
		const stringified = JSON.stringify({title: title});
		
		if(reference.classList.contains('profile-link')) {
                    return capitalize(htmlDecode(title));
		} else {
                    return htmlDecode(title);
		}
	    }
        },
        theme: 'godlybehaviour',
        arrow: false
    });
}

//quick login
if(document.querySelector('body').classList.contains('g-2')) {
    initQuickLogin();
} else {
    if($('#quick-login').length) {
        $('#quick-login').remove();
    }
    $('#quick-login-clip').remove();
}

//init clipboards
let clipboards = document.querySelectorAll('tag-code');
let codes = document.querySelectorAll(`table[id='CODE-WRAP']`);
if (clipboards.length > 0) {
    initClipboard();
}
if (codes.length > 0) {
    initCodebox();
}

//handle translations
document.querySelectorAll('tag-translation').forEach(translation => {
    translation.dataset.result = translation.innerText;
});

/********** Initializations **********/
setTheme();
setSize();
initModals();
initMarkdown();
initCopyLink();
highlightCode();

/********** Window Click **********/
document.querySelector('.invisibleEl').addEventListener('click', e => {
	document.querySelectorAll('.menu').forEach(menu => {
        menu.classList.remove('is-open');
    });
	document.querySelectorAll('.button--menu').forEach(button => {
        button.classList.remove('is-open');
    });
	e.target.classList.remove('menu-open');
});

/********** Index & Category View Only **********/
if(pageType === 'idx' || pageType === 'SC') {
	initForums();

    document.querySelector('.stats--recent').innerHTML = document.querySelector('#recent-topics table').outerHTML;
    document.querySelector('#recent-topics').remove();
}

/********** Topic List Only **********/
if(pageType === 'SF') {
	initForums();
    initTopicsWrap();
    initTopicDescription('.topic--desc');
    initStickyBar();
}

/********** Post View Only **********/
if(pageType === 'ST') {
    initPostRowDescription();
    initPostContentAlter();
    initStickyBar();
    initMarkdown();
    //initDiscordTagging();
}

/********** Member List Only **********/
if(pageType === 'Members') {
	initMembers();
}

/********** UCP Menu **********/
if(pageType === 'UserCP' || pageType === 'Msg') {
	initUCPMenu();

	//Edit Profile Edits
	if($('body.code-01').length > 0 && pageType === 'UserCP') {
        cpShift();
        splitProfile();
        ucpAesthetics();
        ucpAvatars();
        document.querySelectorAll(fullWidthFields).forEach(field => field.classList.add('fullWidth'));
        document.querySelectorAll(halfWidthFields).forEach(field => field.classList.add('halfWidth'));
        
        toggleFields.forEach(toggle => {
            document.querySelector(toggle).addEventListener('change', () => {
                cpShift();
                splitProfile();
                ucpAesthetics();
                ucpAvatars();
            });
        });

        aestheticImageFields.forEach(field => {
            document.querySelector(field).addEventListener('keyup', () => {
                ucpAesthetics();
            });
        });

        avatarImageFields.forEach(field => {
            document.querySelector(field).addEventListener('keyup', () => {
                ucpAvatars();
            });
        });
    }

    //subaccounts
    if($('body.code-54').length > 0 && pageType === 'UserCP') {
        document.querySelectorAll('input[name="sub_ids[]"]').forEach(input => {
            inputWrap(input);
        });
        fancyBoxes();
    }

    //alerts
    if($('body.code-alerts').length > 0 && pageType === 'UserCP') {
        document.querySelectorAll('input[name="alert_id[]"]').forEach(input => {
            inputWrap(input);
        });
        fancyBoxes();
    }

    //forum and topic subscriptions
    if ((pageClasses.contains('code-50') || pageClasses.contains('code-26')) && pageType === 'UserCP') {
        document.querySelectorAll('.tableborder > table > tbody > tr').forEach(row => {
            if(row.querySelectorAll('th, td').length === 1) {
                row.classList.add('ucp--header', 'pformstrip');
            }
        });

        if(pageClasses.contains('code-26')) {
            document.querySelectorAll(`.tableborder input[type="checkbox"]`).forEach(input => inputWrap(input));
            fancyBoxes();
        }
    }
    
    //board settings
    if (pageClasses.contains('code-04') && pageType === 'UserCP') {
        inputWrap(document.querySelector(`input[name="DST"]`));
        fancyBoxes();
    }
    
    //alert settings
    if ((pageClasses.contains('code-alerts_settings') || pageClasses.contains('code-02')) && pageType === 'UserCP') {
        document.querySelectorAll(`input[type="checkbox"]`).forEach(input => inputWrap(input));
        fancyBoxes();
    }

    //inbox
    if($('body.code-01').length > 0 && pageType === 'Msg') {
        document.querySelectorAll('#ucpcontent > form .dlight td:last-child .forminput[type="checkbox"]').forEach(input => {
            inputWrap(input);
        });
        fancyBoxes();
    }
    
    //send message
    if (pageClasses.contains('code-04') && pageType === 'Msg') {
        document.querySelectorAll(`input[type="checkbox"]`).forEach(input => inputWrap(input));
        fancyBoxes();
    }
}

/********** Store Only **********/
if(pageType === 'store') {
    initStoreMenu();
    
    //edit inventory settings
    if (pageClasses.contains('store-do_staff_inventory') && pageType === 'store') {
        document.querySelectorAll(`input[type="checkbox"]`).forEach(input => inputWrap(input));
        fancyBoxes();
    }
}

/********** New Post/Reply Only **********/
if(pageType === 'Post') {
    if(document.querySelector('#topic-title')) {
        document.querySelector('#topic-title input').setAttribute('placeholder', 'Topic Title');
        document.querySelector('#topic-desc input').setAttribute('placeholder', 'Topic Description');
    }

    if(document.querySelector('#post-preview')) {
        initPostContentAlter('#post-preview > .row1 > .postcolor');
    }
    
    initMarkdown();
    let textNodes = getAllTextNodes(document.querySelector('#post-options .pformright'));
    if(textNodes) {
        textNodes.forEach(node => {
            const paragraph = document.createElement('p');
            node.after(paragraph);
            paragraph.appendChild(node);
        });
    }

    inputWrap(`input[name="enableemo"]`, 'br');
    inputWrap(`input[name="enablesig"]`, 'br');
    inputWrap(`input[name="enabletrack"]`, 'br');
    document.querySelectorAll('input[name="iconid"]').forEach(icon => {
        inputWrap(icon, `input`, 'radio');
    });
    fancyBoxes();
}

/********** Online List Only **********/
if(pageType === 'Online') {
    let nameRows = document.querySelectorAll('#Online main > .tableborder:nth-of-type(2) .maintitle + table > tbody > tr > td');
    nameRows.forEach(row => row.innerHTML = row.innerHTML.replaceAll('(', '').replaceAll(')', ''));
}

/********** Reg Only **********/
if(pageType === 'Reg') {
    let textNodes = getAllTextNodes(document.querySelector('main > form'));
    if(textNodes) {
        textNodes.forEach(node => {
            const paragraph = document.createElement('p');
            node.after(paragraph);
            paragraph.appendChild(node);
        });
    }
    let textNodesArray = getAllTextNodesArray(document.querySelectorAll('fieldset'));
    textNodesArray.forEach(node => {
        const paragraph = document.createElement('span');
        node.after(paragraph);
        paragraph.appendChild(node);
    });

    document.querySelectorAll(`main > .tableborder .row2 input[type="checkbox"]`).forEach(input => inputWrap(input));
    document.querySelectorAll(`fieldset input[type="checkbox"]`).forEach(input => inputWrap(input));
    fancyBoxes();
    if(document.querySelector('input[name="agree"][type="checkbox"]')) {
        $('input[name="agree"][type="checkbox"]').wrap('<label class="input-wrap tos"></label>');
        $('.input-wrap.tos').append('<div class="fancy-input checkbox"><i class="fa-solid fa-check"></i></div> <p>I agree to the terms of this registration, <b>I am at least 18 years of age,</b> and wish to proceed.</p>');
    }

    if($('#Reg main > form .tablepad > table > tbody > tr:first-child > td:last-child > div > table > tbody > tr > td:first-child')) {
        $('#Reg main > form .tablepad > table > tbody > tr:first-child > td:last-child > div > table > tbody > tr > td:first-child').append($('#Reg main > form .tablepad > table > tbody > tr:first-child > td:first-child fieldset:last-child'));
    }
}

/********** Login Only **********/
if(pageType === 'Login') {
    let textNodes = getAllTextNodes(document.querySelector('main'));
    if(textNodes) {
        textNodes.forEach(node => {
            const paragraph = document.createElement('p');
            node.after(paragraph);
            paragraph.appendChild(node);
        });
    }
    $("main > p").nextUntil("div.tableborder").andSelf().wrapAll("<div class='container'></div>");
    $(`input[name="UserName"]`).attr('placeholder','Username');
    $(`input[name="PassWord"]`).attr('placeholder','Password');
}

/********** Search Only **********/
if(pageType === 'Search') {
    initTopicDescription(`.tablebasic > tbody > tr > td:nth-child(3) .desc`);
    document.querySelectorAll(`.tablebasic > tbody > tr > td:nth-child(3) .desc`).forEach(desc => {
        if(desc.innerText.trim() === '') {
            desc.remove();
        }
    });

    if (document.querySelector('body.code-show')) {
        initPostContentAlter('main > .tableborder .tablebasic .post1');
    }
}