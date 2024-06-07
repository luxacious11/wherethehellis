/****** Utilities ******/
function fixMc(str) {
    return (""+str).replace(/Mc(.)/g, function(m, m1) {
        return 'Mc' + m1.toUpperCase();
    });
}
function fixMac(str) {
    return (""+str).replace(/Mac(.)/g, function(m, m1) {
        return 'Mac' + m1.toUpperCase();
    });
}
function capitalize(str, separators = [` `, `'`, `-`]) {
    str = str.replaceAll(`\&\#39\;`, `'`);
    separators = separators || [ ' ' ];
    var regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    let first = str.split(' ')[0].replace(regex, function(x) { return x.toUpperCase(); });
    let last = fixMac(fixMc(str.split(' ').slice(1).join(' ').replace(regex, function(x) { return x.toUpperCase(); })));
    return `${first} ${last}`;
}
function capitalizeMultiple(selector) {
    document.querySelectorAll(selector).forEach(character => {
        character.innerText = capitalize(character.innerText);
    });
}
function setMonth(month) {
    switch(month) {
        case 'January':
            month = 1;
            break;
        case 'February':
            month = 2;
            break;
        case 'March':
            month = 3;
            break;
        case 'April':
            month = 4;
            break;
        case 'May':
            month = 5;
            break;
        case 'June':
            month = 6;
            break;
        case 'July':
            month = 7;
            break;
        case 'August':
            month = 8;
            break;
        case 'September':
            month = 9;
            break;
        case 'October':
            month = 10;
            break;
        case 'November':
            month = 11;
            break;
        case 'December':
            month = 12;
            break;
        default:
            month = -1;
            break;
    }

    return month;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function cleanText(text) {
	return text.replaceAll(' ', '').replaceAll('&amp;', '').replaceAll('&', '').replaceAll(`'`, '').replaceAll(`"`, '').replaceAll(`.`, '').replaceAll(`(`, '').replaceAll(`)`, '').replaceAll(`,`, '').replaceAll(`’`, '').replaceAll(`é`, `e`).replaceAll(`è`, `e`).replaceAll(`ê`, `e`).replaceAll(`ë`, `e`).replaceAll(`ě`, `e`).replaceAll(`ẽ`, `e`).replaceAll(`ē`, `e`).replaceAll(`ė`, `e`).replaceAll(`ę`, `e`).replaceAll(`à`, `a`).replaceAll(`á`, `a`).replaceAll(`â`, `a`).replaceAll(`ä`, `a`).replaceAll(`ǎ`, `a`).replaceAll(`æ`, `ae`).replaceAll(`ã`, `a`).replaceAll(`å`, `a`).replaceAll(`ā`, `a`).replaceAll(`í`, `i`).replaceAll(`ì`, `i`).replaceAll(`ı`, `i`).replaceAll(`î`, `i`).replaceAll(`ï`, `i`).replaceAll(`ǐ`, `i`).replaceAll(`ĭ`, `i`).replaceAll(`ī`, `i`).replaceAll(`ĩ`, `i`).replaceAll(`į`, `i`).replaceAll(`ḯ`, `i`).replaceAll(`ỉ`, `i`).replaceAll(`ó`, `o`).replaceAll(`ò`, `o`).replaceAll(`ȯ`, `o`).replaceAll(`ô`, `o`).replaceAll(`ö`, `o`).replaceAll(`ǒ`, `o`).replaceAll(`ŏ`, `o`).replaceAll(`ō`, `o`).replaceAll(`õ`, `o`).replaceAll(`ǫ`, `o`).replaceAll(`ő`, `o`).replaceAll(`ố`, `o`).replaceAll(`ồ`, `o`).replaceAll(`ø`, `o`).replaceAll(`ṓ`, `o`).replaceAll(`ṑ`, `o`).replaceAll(`ȱ`, `o`).replaceAll(`ṍ`, `o`).replaceAll(`ú`, `u`).replaceAll(`ù`, `u`).replaceAll(`û`, `u`).replaceAll(`ü`, `u`).replaceAll(`ǔ`, `u`).replaceAll(`ŭ`, `u`).replaceAll(`ū`, `u`).replaceAll(`ũ`, `u`).replaceAll(`ů`, `u`).replaceAll(`ų`, `u`).replaceAll(`ű`, `u`).replaceAll(`ʉ`, `u`).replaceAll(`ǘ`, `u`).replaceAll(`ǜ`, `u`).replaceAll(`ǚ`, `u`).replaceAll(`ṹ`, `u`).replaceAll(`ǖ`, `u`).replaceAll(`ṻ`, `u`).replaceAll(`ủ`, `u`).replaceAll(`ȕ`, `u`).replaceAll(`ȗ`, `u`).replaceAll(`ư`, `u`);
}
function filterValue(e) {
    let searchValue = e.value.toLowerCase().trim();
    let names = document.querySelectorAll(`[data-key="${e.dataset.filter}"] .claim ${e.dataset.objects}`);
    let headers = document.querySelectorAll(`[data-key="${e.dataset.filter}"] ${e.dataset.headers}`);
    let wraps = document.querySelectorAll(`[data-key="${e.dataset.filter}"] .claim-wrap`);
    if(searchValue !== '') {
        e.parentNode.classList.add('pb');
        e.closest('.scroll').querySelectorAll('.accordion--trigger, .accordion--content').forEach(item => item.classList.add('is-active'));
        names.forEach(name => {
            let nameValue = name.innerText.toLowerCase().trim();
            if (nameValue.indexOf(searchValue) > -1) {
                name.closest('.claim').classList.remove('hidden');
            } else {
                name.closest('.claim').classList.add('hidden');
            }
            let childrenArray = Array.from(name.closest('.claim-wrap').querySelectorAll('.claim')).filter(item => !item.classList.contains('hidden'));
            if(childrenArray.length === 0) {
                name.closest('.claim-wrap').previousElementSibling.classList.add('hidden');
                if (e.dataset.hideWrap === 'true') {
                            name.closest('.claim-wrap').classList.add('hidden');
                }
            } else {
                name.closest('.claim-wrap').previousElementSibling.classList.remove('hidden');
                if (e.dataset.hideWrap === 'true') {
                            name.closest('.claim-wrap').classList.remove('hidden');
                }
            }
        });
    } else {
        e.parentNode.classList.remove('pb');
        headers.forEach(header => header.classList.remove('hidden'));
        names.forEach(name => name.closest('.claim').classList.remove('hidden'));
        wraps.forEach(wrap => wrap.classList.remove('hidden'));
        e.closest('.scroll').querySelectorAll('.accordion--trigger, .accordion--content').forEach(item => item.classList.remove('is-active'));
    }
}
function appendSearchQuery(param, value) {
	const url = new URL(window.location.href);
	url.searchParams.set(param, value);
	window.history.replaceState(null, null, url);
}
function translationSwitch(e) {
        let current = e.innerText;
        let original = e.dataset.original;
        let translation = e.dataset.result;
        if(current === original) {
            e.innerText = translation;
        } else {
            e.innerText = original;
        }
}
function highlightCode() {
    let clipcodeQuick = new Clipboard('.copyQuick', {
        target: function(trigger) {
            if(trigger.nextElementSibling.querySelector('textarea')) {
                return trigger.nextElementSibling.querySelector('textarea');
            } else {
                return trigger.nextElementSibling.querySelector('code');
            }
        }
    });
}
function getAllTextNodes(element) {
    if(element) {
        return Array.from(element.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim().length > 1);
    }
}
function getAllTextNodesArray(elements) {
    let array = [];
    if(elements) {
        elements.forEach(element => {
            let nodes = Array.from(element.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim().length > 1);
            if(nodes.length > 0) {
                array = [...array, ...nodes];
            }
        });
    }
    return array;
}
function inputWrap(el, next = null, type = 'checkbox') {
    if(next) {
        $(el).nextUntil(next).andSelf().wrapAll(`<label class="input-wrap ${type}"></label>`);
    } else {
        $(el).next().andSelf().wrapAll(`<label class="input-wrap ${type}"></label>`);
    }
}
function fancyBoxes() {
    document.querySelectorAll('.input-wrap.checkbox').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input checkbox"><i class="fa-solid fa-check"></i></div>`);
    });
    document.querySelectorAll('.input-wrap.radio').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input radio"><i class="fa-solid fa-check"></i></div>`);
    });
}
function read_alerts() {
    let allMenus = document.querySelectorAll('.menu');
    let allButtons = document.querySelectorAll('.button--menu');
    allMenus.forEach(menu => menu.classList.remove('is-open'));
    allButtons.forEach(button => button.classList.remove('is-open'));
    document.querySelector('.invisibleEl').classList.remove('menu-open');
    $.get( "index.php?recent_alerts=1&read=1", function( data ) {
        $( "#recent_alerts_data" ).html( data );
    });
    document.querySelector(`button[data-menu=".nav--alerts"]`).dataset.new = 0;
}
function createAvatars(classes, id, attributes = ``) {
    let html = `<div class="${classes}" style="background-image: `;
    for(let i = 0; i < fileTypes.length; i++) {
        html += `url(https://files.jcink.net/${uploads}/${siteName}/av-${id}.${fileTypes[i]}),`;
    }
    html += `url(${defaultSquare});" ${attributes}></div>`;
    return html;
}
function formatQuickList(list) {
    let html = ``;

    if(list.innerHTML.split(`+ `).length > 0) {
        html = `<ul>
            ${list
            .innerHTML.split(`+ `)
            .filter(item => item !== '' && item !== '\n')
            .map(item => `<li>${item}</li>`).join('')}
        </ul>`;
    }

    return html;
}

/****** Settings ******/
function setTheme() {
    if(localStorage.getItem('theme') !== null) {
        switch(localStorage.getItem('theme')) {
            case 'light':
                document.querySelector('body').classList.remove('dark');
                document.querySelector('body').classList.add('light');
                break;
            case 'dark':
            default:
                document.querySelector('body').classList.add('dark');
                document.querySelector('body').classList.remove('light');
                break;
        }
    } else {
        document.querySelector('body').classList.add('dark');
        document.querySelector('body').classList.remove('light');
        localStorage.setItem('theme', 'dark');
    }
}
function setSize() {
    if(localStorage.getItem('size') !== null) {
        switch(localStorage.getItem('size')) {
            case 'xl':
                document.querySelector('body').classList.remove('smFont');
                document.querySelector('body').classList.remove('lgFont');
                document.querySelector('body').classList.add('xlFont');
                break;
            case 'large':
                document.querySelector('body').classList.remove('smFont');
                document.querySelector('body').classList.add('lgFont');
                document.querySelector('body').classList.remove('xlFont');
                break;
            case 'small':
            default:
                document.querySelector('body').classList.remove('lgFont');
                document.querySelector('body').classList.add('smFont');
                document.querySelector('body').classList.remove('xlFont');
                break;
        }
    } else {
        document.querySelector('body').classList.remove('xlFont');
        document.querySelector('body').classList.remove('lgFont');
        document.querySelector('body').classList.add('smFont');
        localStorage.setItem('size', 'small');
    }
}

/****** Toggles ******/
function toggleTheme() {
    if(localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
        setTheme();
    } else {
        localStorage.setItem('theme', 'dark');
        setTheme();
    }
}
function toggleSize() {
    if(localStorage.getItem('size') === 'small') {
        localStorage.setItem('size', 'large');
        setSize();
    } else if(localStorage.getItem('size') === 'large') {
        localStorage.setItem('size', 'xl');
        setSize();
    } else {
        localStorage.setItem('size', 'small');
        setSize();
    }
}
function toggleMenu(e) {
    let menu = document.querySelector(e.dataset.menu);
    let allMenus = document.querySelectorAll('.menu');
    let allButtons = document.querySelectorAll('.button--menu');
    if (e.classList.contains('is-open')) {
        allMenus.forEach(menu => menu.classList.remove('is-open'));
        allButtons.forEach(button => button.classList.remove('is-open'));
	    document.querySelector('.invisibleEl').classList.remove('menu-open');
    } else {
        allMenus.forEach(menu => menu.classList.remove('is-open'));
        allButtons.forEach(button => button.classList.remove('is-open'));
        menu.classList.add('is-open');
        e.classList.add('is-open');
	    document.querySelector('.invisibleEl').classList.add('menu-open');
        
        if(menu.getAttribute('id') === 'recent-alerts') {
            $.get( "?recent_alerts=1", function( data ) {
                $( "#recent-alerts-data" ).html( data );
            }).done(function() {
                document.querySelectorAll('.recent-alerts-msg').forEach(alert => {
                    if(alert.querySelectorAll('a').length === 1) {
                        alert.classList.add('reg-alert');
                    }
                });
            });
        }
    }
}

/****** Global Initialization ******/
function initClipboard() {
    let clipboard = new Clipboard('.clipboard');
    clipboard.on('success', function(e) {
        console.log('clipboard success: ' + e);
    });
    clipboard.on('error', function(e) {
        console.log('clipboard error: ' + e);
    });
    let clipcode = new Clipboard('.codeclick', {
        target: function(trigger) {
        return trigger.nextElementSibling;
        }
    });
}
function initCodebox() {
    $("table[id='CODE-WRAP']").each(function() {
        var cc = $(this).find("td[id='CODE']").html();

        $(this).html(
            "<div class='codeblock code--wrapper'><div class='c-title codeclick'>Click to Copy</div><div class='codecon'><pre><code class='scroll'>"
            + cc +
            "</code></pre></div></div>"
        );
    });
}
function initCopyLink() {
    let clippedURL = new Clipboard('.post--permalink');
    document.querySelectorAll('.post--permalink').forEach(link => {
        link.addEventListener('click', e => {
            e.currentTarget.querySelector('.note').style.opacity = 1;
            setTimeout(() => {
                document.querySelectorAll('.note').forEach(note => note.style.opacity = 0);
            }, 3000);
        });
    });
}
function initQuickLogin() {
    if($('#quick-login').length) {
        $('#quick-login').appendTo('#quick-login-clip');
        document.querySelector('#quick-login-clip input[name="UserName"]').setAttribute('placeholder', 'Username');
        document.querySelector('#quick-login-clip input[name="PassWord"]').setAttribute('placeholder', 'Password');
    } else {
        var main_url = location.href.split('?')[0];
        $.get(main_url, function (data) {
            $('#quick-login', data).appendTo('#quick-login-clip');
            document.querySelector('#quick-login-clip input[name="UserName"]').setAttribute('placeholder', 'Username');
            document.querySelector('#quick-login-clip input[name="PassWord"]').setAttribute('placeholder', 'Password');
        });
    }
}
function initModals() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', () => {
            let modalTag = popup.dataset.modal,
                modals = document.querySelectorAll('.modal'),
                modal;
            for(let i = 0; i < modals.length; i++) {
                if(modals[i].dataset.modalBox === modalTag) {
                    modal = modals[i];
                    modal.classList.add('is-open');
                }
            }
        });
    });
    document.querySelectorAll('.modal').forEach(modal => {
        window.addEventListener('click', e => {
            if(e.target.classList.contains('modal') || e.target.classList.contains('modal--close') || (e.target.parentNode && e.target.parentNode.classList.contains('modal--close')) || (e.target.parentNode && e.target.parentNode.parentNode && e.target.parentNode.parentNode.classList.contains('modal--close'))) {
                modal.classList.remove('is-open');
            }
        });
    });
}
function initSwitcher() {
	let characters = switcher.querySelectorAll('option');
	let newSwitch = `<div class="switch">`;
	characters.forEach((character, i) => {
		if(i !== 0) {
			let characterName = character.innerText.trim();
			let characterId = character.value;
			newSwitch += `<label class="switch--block">
				<input type="checkbox" value="${characterId}" onchange="this.form.submit()" name="sub_id" />
				${createAvatars(`switch--image`, characterId)}
				<b>${capitalize(characterName)}</b>
			</label>`;
		}
	});
	newSwitch += `</div>`;
	switcher.insertAdjacentHTML('afterend', newSwitch);
	switcher.remove();
}
function formatMarkdown(str, identifier, opening, closing) {
    str = str
      .split(identifier)
      .map((value, index) => {
            if ((value.includes('href=') ||
                   value.includes('target=') ||
                   value.includes('src=')) &&
                  str.split(identifier).length > 1) {
                return `${value}${identifier}`;
            } else if(index % 2 == 0) {
                return value;
            } else {
                return `${opening}${value}${closing}`;
            }
      }).join('');
    return str;
}
function initMarkdown() {
    let quickLists = document.querySelectorAll('tl');
    if(quickLists.length > 0) {
        quickLists.forEach(list => {
            list.innerHTML = formatQuickList(list);
        });
    }

    if(document.querySelectorAll(markdownSafe).length > 0) {
        document.querySelectorAll(markdownSafe).forEach(post => {
            let str = post.innerHTML;
            str = formatMarkdown(str, `**`, `<b>"`, `"</b>`);
            str = formatMarkdown(str, `_`, `<i>`, `</i>`);
            str = formatMarkdown(str, `||`, `<tag-spoiler>`, `</tag-spoiler>`);
            post.innerHTML = str;
        });
    }

    let spoilers = document.querySelectorAll('tag-spoiler');
    if(spoilers.length > 0) {
        spoilers.forEach(spoiler => {
            spoiler.addEventListener('click', e => {e.currentTarget.classList.add('is-visible')});
        });
    }
}

/****** Special Function Initialization ******/
function initTabs(isHash = false, wrapClass, menuClass, tabWrapClass, activeClass = 'is-active', categoryClass = null, firstClasses = []) {
    if(isHash) {
        window.addEventListener('hashchange', function(e){
            initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass);
        });

        //hash linking
        if (window.location.hash){
            initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass);
        } else {
            initFirstHashTab(firstClasses, activeClass);
        }
    } else {
        initRegularTabs(menuClass);
    }
}
function initRegularTabs(menuClass) {
    let labels = document.querySelectorAll(`${menuClass} > tag-label`);
    labels.forEach(label => {
        label.addEventListener('click', e => {
            let selected = e.currentTarget;
            let tab = document.querySelector(`tag-tab[data-key="${selected.dataset.key}"]`);
            let tabSiblings = Array.from(tab.parentNode.children);
            let tabIndex = tabSiblings.indexOf.call(tabSiblings, tab);
            
            labels.forEach(label => label.classList.remove('is-active'));
            tabSiblings.forEach(tab => tab.classList.remove('is-active'));
            
            selected.classList.add('is-active');
            tab.classList.add('is-active');
            tabSiblings.forEach(sibling => sibling.style.left = `${-100 * tabIndex}%`);
        });
    });
}
function initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass = null) {
    //set variables for categories
    let selectedCategory, hashMain, hashCategory, hashCategoryArray, categorySiblings = [], categoryIndex, hashTab;

    //get hash and set basic variables
    let hash = $.trim( window.location.hash );
    let selected = document.querySelector(`${menuClass} a[href="${hash}"]`);
    let hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
    let unsetDefault = Array.from(selected.parentNode.children);
    let tabSiblings = Array.from(hashContent.parentNode.children);
    let tabIndex = tabSiblings.indexOf.call(tabSiblings, hashContent);

    //set category variables document.querySelector(`.webpage--menu a[href="#tab2-2"]`).closest('.tab-category').getAttribute('data-category')
    if(categoryClass) {
        selectedCategory = selected.closest(categoryClass).getAttribute('data-category');

        hashMain = document.querySelector(`${menuClass} tag-label[data-category="${selectedCategory}"]`);

        hashCategory = document.querySelector(`${menuClass} tag-label[data-category="${selectedCategory}"]`);
        hashCategoryArray = document.querySelectorAll(`${menuClass} [data-category="${selectedCategory}"]`);
        hashCategoryTab = document.querySelector(`tag-tab[data-category="${selectedCategory}"]`);
        
        hashTab = document.querySelector(`${tabWrapClass} tag-tab[data-category="${selectedCategory}"]`);

        if(hashCategoryTab) {
            categorySiblings = Array.from(hashCategoryTab.parentNode.children);
            categoryIndex = categorySiblings.indexOf.call(categorySiblings, hashCategoryTab);
        }
    }

    //find the sub menu/inner menu link with the matching hash
    if (hash) {
        $(selected).trigger('click');
    }

    //Tabs
    //Remove active from everything
    document.querySelectorAll(`${menuClass} tag-label`).forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(`${menuClass} a`).forEach(label => label.classList.remove(activeClass));
    unsetDefault.forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(`${wrapClass} tag-tab`).forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(categoryClass).forEach(item => item.classList.remove(activeClass));

    //Add active
    selected.classList.add(activeClass);
    hashCategoryArray.forEach(item => item.classList.add(activeClass));
    hashContent.classList.add(activeClass);
    tabSiblings.forEach(tab => tab.style.right = `${tabIndex * -100}%`);

    //add active for category
    if(categoryClass) {
        hashMain.classList.add(activeClass);
        hashTab.classList.add(activeClass);
        categorySiblings.forEach(tab => tab.style.right = `${categoryIndex * -100}%`);
    }

    document.querySelector(menuClass).classList.remove('is-open');

    window.scrollTo(0, 0);
}
function initFirstHashTab(firstClasses, activeClass) {
    //Auto-select tab without hashtag present
    firstClasses.forEach(firstClass => {
        document.querySelector(firstClass).classList.add(activeClass);
    });
}
function initAccordion(target = '.accordion') {
    document.querySelectorAll(target).forEach(accordion => {
        let triggers = accordion.querySelectorAll(':scope > .accordion--trigger');
        let contents = accordion.querySelectorAll(':scope > .accordion--content');
        if(window.innerWidth <= 480) {
            triggers.forEach(trigger => trigger.classList.remove('is-active'));
            contents.forEach(trigger => trigger.classList.remove('is-active'));
        }
        triggers.forEach(trigger => {
            trigger.addEventListener('click', e => {
                let alreadyOpen = false;
                if(e.currentTarget.classList.contains('is-active')) {
                    alreadyOpen = true;
                }
                triggers.forEach(trigger => trigger.classList.remove('is-active'));
                contents.forEach(trigger => trigger.classList.remove('is-active'));
                if(alreadyOpen) {
                    e.currentTarget.classList.remove('is-active');
                    e.currentTarget.nextElementSibling.classList.remove('is-active');
                    alreadyOpen = false;
                } else {
                    e.currentTarget.classList.add('is-active');
                    e.currentTarget.nextElementSibling.classList.add('is-active');
                }
            });
        })
    })
}

/****** Profile Initialization ******/
function formatName(name) {
    let nameArray = capitalize(name).split(' ').filter(item => item !== '');
    let formattedName = ``;
    if(nameArray.length > 1) {
        let surnames = [...nameArray];
        surnames.shift();
        formattedName = `<b>${nameArray[0]}</b><span>${surnames.join(' ')}</span>`
    } else {
        formattedName = `<b>${nameArray[0]}</b>`;
    }
    return formattedName;
}
function setRatings(lang, sex, vio, selectorPrefix = ``) {
    let ratings = [
        {'type': 'lang','value': lang},
        {'type': 'sex','value': sex},
        {'type': 'vio','value': vio}
    ];
    ratings.forEach(rating => formatRating(rating, selectorPrefix));
}
function formatRating(rating, selectorPrefix = ``) {
    if(rating.value === 'Any') {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 3;
    } else if(rating.value === 'With Limits') {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 2;
    } else if(rating.value === 'Mild') {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 1;
    } else {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 0;
    }
}
function setOverflow(overflow) {
    if(overflow !== `` && overflow !== `<i>No Information</i>`) {
        document.querySelector('#clip-overflow').insertAdjacentHTML('beforeend', overflow);
    }
}            
function Alpha(arr) {
    // SUBACCOUNTS PROFILE DISPLAY SCRIPT (ABC ORDER) by tonya aka wildflower
    let newArr = Array.prototype.slice.call(arr).map(item => {
        if (item.value === '-------------------') {
            return null
        }
        return {
            character: item.innerText.trim().toLowerCase().replace(`» `, ``),
            account: item.value
        }
    })
    .filter(item => item !== null)
    .sort((a, b) => {
        if(a.character > b.character) {
            return 1;
        } else if (a.character < b.character) {
            return -1;
        } else {
            return 0;
        }
    });
    return newArr;
}
function setRoster() {   
    let alphaChars = Alpha(document.querySelectorAll('select[name=showuser] option'));
    alphaChars.forEach(character => {
        let imageDiv = createAvatars('profile--account-image', character.account, attributes = ``);

        let html = `<a class="profile--account" href="?showuser=${character.account}">
            ${imageDiv}
            <div class="profile--account-info">
                <b>${character.character}</b>
                <span>view profile</span>
            </div>
        </a>`;

        document.querySelector('.profile--roster .profile--item span').insertAdjacentHTML('beforeend', html);
    });
}
function calculateAge(year, month, day) {
    let current = new Date();
    let currentYear = current.getFullYear();
    let currentMonth = current.getMonth() + 1;
    let currentDay = current.getDate();
    let birthYear = year;
    let birthMonth = setMonth(month);;
    let birthDay = day;
    let age = ``;
    if(birthMonth < currentMonth || (birthMonth === currentMonth && birthDay <= currentDay)) {
        age = currentYear - birthYear;
    } else {
        age = currentYear - birthYear - 1;
    }
    return age;
}
function formatAesthetics(aesthetics, images) {
    let imageHTML;
    switch (aesthetics) {
        case 'LargeMosaic':
            imageHTML = `<span class="threeWide twoTall"><img src="${images['wide-1']}" loading="lazy" /></span>
            <span><img src="${images['square-1']}" loading="lazy" /></span>
            <span><img src="${images['square-2']}" loading="lazy" /></span>
            <span class="twoWide twoTall"><img src="${images['square-3']}" loading="lazy" /></span>
            <span class="twoWide twoTall"><img src="${images['square-4']}" loading="lazy" /></span>
            <span class="threeWide twoTall"><img src="${images['wide-2']}" loading="lazy" /></span>
            <span class="twoTall"><img src="${images['tall-1']}" loading="lazy" /></span>`;
            break;
        case 'SmallMosaic':
            imageHTML = `<span><img src="${images['square-1']}" loading="lazy" /></span>
            <span class="twoWide"><img src="${images['wide-1']}" loading="lazy" /></span>
            <span class="twoWide twoTall"><img src="${images['square-2']}" loading="lazy" /></span>
            <span class="threeTall"><img src="${images['tall-1']}" loading="lazy" /></span>
            <span class="twoWide"><img src="${images['wide-2']}" loading="lazy" /></span>`;
            break;
        case 'Columns':
            imageHTML = `<span class="twoTall"><img src="${images['tall-1']}" loading="lazy" /></span>
            <span><img src="${images['square-1']}" loading="lazy" /></span>
            <span class="twoTall"><img src="${images['tall-2']}" loading="lazy" /></span>
            <span><img src="${images['square-2']}" loading="lazy" /></span>`;
            break;
        case 'Single':
        default: 
        imageHTML = `<span><img src="${images['tall-1']}" loading="lazy" /></span>`;
            break;
    }
    return imageHTML;
}
function formatPowers(powers) {
    if(!powers.one && !powers.two && !powers.three) {
        return ``;
    }

    let powersHTML = ``;
    if(powers.one) {
        powersHTML += `<tag-highlight>${powers.one}</tag-highlight>`;
    }
    if(powers.two) {
        powersHTML += `<tag-highlight>${powers.two}</tag-highlight>`;
    }
    if(powers.three) {
        powersHTML += `<tag-highlight>${powers.three}</tag-highlight>`;
    }

    return powersHTML;
}
function charactersOnly(aesthetics, images, year, month, day, powers, character, overflow) {
    document.querySelectorAll('.memAccOnly').forEach(item => item.remove());
    document.querySelectorAll('.powers--Powerless .powersOnly').forEach(item => item.remove());

    if(aesthetics !== `<i>No Information</i>` && aesthetics !== ``) {
        document.querySelector('.profile--aesthetic').classList.add(aesthetics.replace(' ', ''));
        document.querySelector('.profile--aesthetic').innerHTML = formatAesthetics(cleanText(aesthetics), images);
    }

    document.querySelector('age-clip').innerText = calculateAge(year, month, day);

    if(document.querySelector('power-clip')) {
        document.querySelector('power-clip').innerHTML = formatPowers(powers);
    }

    setOverflow(overflow);

    FillTracker(character, trackerParams);
}
function membersOnly() {
    document.querySelectorAll('.charOnly').forEach(item => item.remove());
    setRoster();
}
function initProfileTabs() {
    window.addEventListener('hashchange', function(e){
        //get hash
        let hash = window.location.hash;
        let selected = document.querySelector(`.profile a[href="${hash}"]`);
        let hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
        let unsetDefault = Array.from(selected.parentNode.children);
        let tabSiblings = Array.from(hashContent.parentNode.children);
        let tabIndex = tabSiblings.indexOf.call(tabSiblings, hashContent);

        //check for tracker category and adjust
        let innerTab = null, tabParent, parentSiblings, parentIndex;
        if(selected.dataset.category) {
            innerTab = selected;
            selected = document.querySelector(`.profile--menu a[href="#${selected.dataset.category}"]`);
            hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
            tabParent = document.querySelector(`tag-tab[data-key="#${innerTab.dataset.category}"]`);
            parentSiblings = Array.from(tabParent.parentNode.children);
            parentIndex = parentSiblings.indexOf.call(parentSiblings, tabParent);
        }

        //find the sub menu/inner menu link with the matching hash
        if (hash) {
            $(selected).trigger('click');
        }
        //select based on this

        //Tabs
        //Remove active from everything
        document.querySelectorAll('.profile--menu a').forEach(label => label.classList.remove('is-active'));
        unsetDefault.forEach(label => label.classList.remove('is-active'));
        document.querySelectorAll('.profile tag-tab').forEach(label => label.classList.remove('is-active'));
        if(innerTab) {
            Array.from(innerTab.parentNode.children).forEach(label => label.classList.remove('is-active'));
        }

        //Add active
        selected.classList.add('is-active');
        hashContent.classList.add('is-active');
        tabSiblings.forEach(sibling => sibling.style.right = `${-100 * tabIndex}%`);
        if(innerTab) {
            innerTab.classList.add('is-active');
            tabParent.classList.add('is-active');
            parentSiblings.forEach(sibling => sibling.style.right = `${-100 * parentIndex}%`);
        }
        
        if(tabIndex === 0 && hash !== '#active' && hash !== '#tracker') {
            document.querySelector('.profile').classList.add('is-first');
        } else {
            document.querySelector('.profile').classList.remove('is-first');
        }
    });

    //hash linking
    if (window.location.hash){
        //get hash
        let hash = window.location.hash;
        let selected = document.querySelector(`.profile a[href="${hash}"]`);
        let hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
        let unsetDefault = Array.from(selected.parentNode.children);
        let tabSiblings = Array.from(hashContent.parentNode.children);
        let tabIndex = tabSiblings.indexOf.call(tabSiblings, hashContent);

        //check for tracker category and adjust
        let innerTab = null, tabParent, parentSiblings, parentIndex;
        if(selected.dataset.category) {
            innerTab = selected;
            selected = document.querySelector(`.profile--menu a[href="#${selected.dataset.category}"]`);
            hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
            tabParent = document.querySelector(`tag-tab[data-key="#${innerTab.dataset.category}"]`);
            parentSiblings = Array.from(tabParent.parentNode.children);
            parentIndex = parentSiblings.indexOf.call(parentSiblings, tabParent);
        }

        //find the sub menu/inner menu link with the matching hash
        if (hash) {
            $(selected).trigger('click');
        }
        //select based on this

        //Tabs
        //Remove active from everything
        document.querySelectorAll('.profile--menu a').forEach(label => label.classList.remove('is-active'));
        unsetDefault.forEach(label => label.classList.remove('is-active'));
        document.querySelectorAll('.profile tag-tab').forEach(label => label.classList.remove('is-active'));
        if(innerTab) {
            Array.from(innerTab.parentNode.children).forEach(label => label.classList.remove('is-active'));
        }

        //Add active
        selected.classList.add('is-active');
        hashContent.classList.add('is-active');
        tabSiblings.forEach(sibling => sibling.style.right = `${-100 * tabIndex}%`);
        if(innerTab) {
            innerTab.classList.add('is-active');
            tabParent.classList.add('is-active');
            parentSiblings.forEach(sibling => sibling.style.right = `${-100 * parentIndex}%`);
        }

        if(tabIndex === 0 && hash !== '#active' && hash !== '#tracker') {
            document.querySelector('.profile').classList.add('is-first');
        } else {
            document.querySelector('.profile').classList.remove('is-first');
        }
    } else {
        //Auto-select  tab without hashtag present
        document.querySelector('.profile').classList.add('is-first');
        document.querySelector(`.profile--menu a`).classList.add('is-active');
        document.querySelector(`.profile--main > tag-tabset > tag-tab:first-child`).classList.add('is-active');
    }
}
function removeBlankFields() {
    document.querySelectorAll('.profile--item.optional i').forEach(italic => {
        if(italic.innerText === 'No Information') {
            italic.closest('.profile--item').remove();
        }
    })
}
function initProfile(type, aesthetics = null, images = {}, year = null, month = null, day = null, powers = {}, character, overflow) {
    if(type === 'character') {
        charactersOnly(aesthetics, images, year, month, day, powers, character, overflow);
    } else {
        membersOnly();
    }

    removeBlankFields()
    initProfileTabs();
    initAccordion();
}

/****** Index Initialization ******/
function initForums() {
    //manual links
    document.querySelectorAll('.forum .manual-links').forEach(linkSet => {
        //subforums exist
        let subforumEl = linkSet.closest('.forum--desc').nextElementSibling.querySelector('.subforums');
        if(subforumEl) {
            if(linkSet.dataset.position === 'start') {
                subforumEl.insertAdjacentHTML('afterbegin', linkSet.innerHTML);
            } else {
                subforumEl.insertAdjacentHTML('beforeend', linkSet.innerHTML);
            }
        }
        //subforums don't exist
        else {
            linkSet.closest('.forum').querySelector('.forum--links').insertAdjacentHTML('beforeend', linkSet.innerHTML);
            linkSet.closest('.forum').querySelector('.forum--links').classList.add('manual-only');
        }

        linkSet.remove();
    });
    //images
    document.querySelectorAll('.manual-image').forEach(image => {
        let parent = image.closest('.forum');
        parent.insertAdjacentHTML('afterbegin', image.innerHTML);
        image.remove();
    });
    document.querySelectorAll('.forum--links .subforums').forEach(linkSet => {
        if(linkSet.innerText === '') {
            linkSet.closest('.forum--links').classList.add('hidden');
        }
    })
}

/****** Topic Initialization ******/
function initTopicDescription(selector) {
    document.querySelectorAll(selector).forEach(desc => {
        desc.innerHTML = desc.innerHTML.replaceAll('[', '<tag-highlight>').replaceAll(']', '</tag-highlight>');
    });
}
function initTopicsWrap() {
    $(`.macro--header`).each(function (index) {
        $(this).nextUntil(`.macro--header`).wrapAll(`<div class="topics--section"></div>`);
    }); 
}

/****** Post Initialization ******/
function initPostRowDescription() {
    let desc = document.querySelector('.maintitle .topic-desc');
    if(desc.innerText) {
        if(desc.innerText.includes('[')) {
            desc.classList.add('no-border');
        }
        initTopicDescription('.topic-desc');
    } else {
        desc.remove();
        document.querySelector('.postlinksbar').classList.add('no-descript');
    }
}
function initPostContentAlter() {
    document.querySelectorAll('.post--content .postcolor').forEach(post => {
        if(!post.querySelector('* > tag-wrap') && !post.querySelector('* > tag-comm') && !post.querySelector('* > tag-social') && !post.querySelector('* > div') && !post.querySelector('* > span')) {
            post.classList.add('no-template');
        }
    });
    document.querySelectorAll('.post.g-4 .charOnly, .post.g-6 .charOnly, .post.g-3.type-Member .charOnly').forEach(item => item.remove());
}
function initDiscordTagging() {
    let channels = ``, users = ``;
    taggingChannels.forEach(channel => channels += `<option value="${channel.hook}">${channel.name}</option>`);
    taggingUsers.sort((a, b) => {
        if(a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    }).forEach(user => users += `<option value="${user.id}">${user.name}</option>`);

    document.querySelector('#ST main > table').insertAdjacentHTML('afterend', `<div class="alert-options">
        <select id="alert-channel">
            <option value="">-- None --</option>
            ${channels}
        </select>
        <select id="alert-user">
            <option value="">-- None --</option>
            ${users}
        </select>
        <input type="button" name="sendAlert" id="sendAlert" value="Send Alert" />
    </div>`);

    document.querySelector('#sendAlert').addEventListener('click', e => {
        let channel = document.querySelector('#alert-channel');
        let user = document.querySelector('#alert-user');
        let topic = document.querySelector('.topic-title').innerText;
        let url = `${window.location.origin}${window.location.search}view=getnewpost`;
        var characters = document.querySelector('.topic-title').innerText;
        var includes = [...new Set(Array.from(document.querySelectorAll('.post--header > a')).map(item => item.dataset.fullName))];
        var characterList = ``;
        includes.forEach((character, i) => {
            if(includes.length > 2 && i < includes.length && i !== 0) {
                characterList += `, `;
            }
            if(includes.length === 2 && i !== 0) {
                characterList += ` `;
            }
            if ((includes.length === 2 && i !== 0) || (includes.length > 2 && i === includes.length - 1)) {
                characterList += `and `;
            }
            characterList += capitalize(character.toLowerCase()).trim();
        });
        let triggerBlock = document.querySelectorAll('.post--main');
        let triggers = triggerBlock.length > 0 && triggerBlock[triggerBlock.length - 1].querySelector('.profile--warning span') ? triggerBlock[triggerBlock.length - 1].querySelector('.profile--warning span').innerText : false;
        let message = `Featuring ${characterList}`;
        if(triggers) {
            message += `\n**TW:** ${triggers}`;
        }

        if(channel.options[channel.selectedIndex].value !== '' && user.options[user.selectedIndex].value !== '') {
            sendDiscordTag(channel.options[channel.selectedIndex].value, `You've been tagged!`, `[${capitalize(topic.toLowerCase(), [` `, `-`])}](<${url}>)
    ${message}`, `<@${user.options[user.selectedIndex].value}>`);
        }

        document.querySelector('#alert-channel').value = '';
        document.querySelector('#alert-user').value = '';
        document.querySelector('#sendAlert').value = 'Sent!';
        setTimeout(function () {
            document.querySelector('#sendAlert').value = 'Send Alert';
        }, 1000);
    });
}

/****** Members Initialization ******/
function initMembers() {
    initAccordion();
}
function formatMemberRow(type, data, extraFilters = '') {
    let mainInfo = ``;
    let tagList = ``;
    if(type === 'character') {
        tagList = `${type}`;
        mainInfo = ``;
    } else {
        tagList = `${type}`;
        mainInfo = ``;
    }
    return `<div class="grid-item ml--item ${tagList} m-${data.id}">
        <div class="member">
            ${type}
        </div>
        <div class="hidden">
            <span class="mem--name">name</span>
            <span class="mem--age">age</span>
            <span class="mem--posts">posts</span>
            <span class="mem--join">joined</span>
        </div>
    </div>`;
}
function populatePage(array) {
    let html = ``;
    let members = [], membersClean = [];

    for (let i = 0; i < array.length; i++) {
        //Make Member Array
        let member = {raw: array[i].alias, clean: array[i].aliasClass};
        if(jQuery.inArray(member.clean, membersClean) == -1 && member.clean != '') {
            membersClean.push(member.clean);
            members.push(member);
        }

        switch(array[i].groupID) {
            //member only
            case 4:
            case 6:
                html += formatMemberRow('writer', array[i]);
                break;
            //depends
            case 3:
                if(array[i].type === 'character') {
                    html += formatMemberRow('character', array[i]);
                } else {
                    html += formatMemberRow('writer', array[i]);
                }
                break;
            //character only
            default: 
                html += formatMemberRow('character', array[i], 'active');
                break;
        }
    }
    document.querySelector('#ml--rows').insertAdjacentHTML('beforeend', html);


    //sort member array
    members.sort((a, b) => {
        if(a.clean < b.clean) {
            return -1;
        } else if (a.clean > b.clean) {
            return 1;
        } else {
            return 0;
        }
    });

    //Append Arrays
    members.forEach(member => {
        document.querySelector('.ml--filter-group[data-filter-group="member"]').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".${member.clean}"/>${member.raw}</label>`);
    });
}
function setCustomFilter() {
    //get search value
    qsRegex = document.querySelector(typeSearch).value;
    
    //add show class to all items to reset
    elements.forEach(el => el.classList.add(visible));
    
    //filter by nothing
    let searchFilter = '';
    
    //check each item
    elements.forEach(el => {
        let name = el.querySelector(memName).textContent;
        if(!name.toLowerCase().includes(qsRegex)) {
            el.classList.remove(visible);
            searchFilter = `.${visible}`;
        }
    });

    let filterGroups = document.querySelectorAll(filterGroup);
    let groups = [];
    let checkFilters;
    filterGroups.forEach(group => {
        let filters = [];
        group.querySelectorAll('label.is-checked input').forEach(filter => {
            if(filter.value) {
                filters.push(filter.value);
            }
        });
        groups.push({group: group.dataset.filterGroup, selected: filters});
    });

    groups.forEach(group => {
        let tagString = group.selected.join('_');
        appendSearchQuery(group.group, tagString);
    });

    let filterCount = 0;
    let comboFilters = [];
    groups.forEach(group => {
        // skip to next filter group if it doesn't have any values
        if ( group.selected.length > 0 ) {
            if ( filterCount === 0 ) {
                // copy groups to comboFilters
                comboFilters = group.selected;
            } else {
                var filterSelectors = [];
                var groupCombo = comboFilters;
                // merge filter Groups
                for (var k = 0; k < group.selected.length; k++) {
                    for (var j = 0; j < groupCombo.length; j++) {
                        //accommodate weirdness with object vs not
                        if(groupCombo[j].selected) {
                            if(groupCombo[j].selected != group.selected[k]) {
                                filterSelectors.push( groupCombo[j].selected + group.selected[k] );
                            }
                        } else if (!groupCombo[j].selected && group.selected[k]) {
                            if(groupCombo[j] != group.selected[k]) {
                                filterSelectors.push( groupCombo[j] + group.selected[k] );
                            }
                        }
                    }
                }
                // apply filter selectors to combo filters for next group
                comboFilters = filterSelectors;
            }
            filterCount++;
        }
    });
    
    //set filter to blank
    let filter = [];
    //check if it's only search
    if(qsRegex.length > 0 && comboFilters.length === 0) {
        filter = [`.${visible}`];
    }
    //check if it's only checkboxes
    else if(qsRegex.length === 0 && comboFilters.length > 0) {
        let combos = comboFilters.join(',').split(',');
        filter = [...combos];
    }
    //check if it's both
    else if (qsRegex.length > 0 && comboFilters.length > 0) {
        let dualFilters = comboFilters.map(filter => filter + `.${visible}`);
        filter = [...dualFilters];
    }

    //join array into string
    filter = filter.join(', ');

    // bind sort button click
    let currentSort = document.querySelector('.ml--sort.is-checked');
        
    //render isotope
    $container.isotope({
        filter: filter,
        sortBy: currentSort.dataset.sort,
    });
    $container.isotope('layout');
}
function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
        if (timeout) {
        clearTimeout(timeout);
        }

        function delayed() {
        fn();
        timeout = null;
        }
        setTimeout(delayed, threshold || 100);
    };
}

/****** UserCP/Messages ******/
function initUCPMenu() {
    document.querySelector('#ucpmenu').innerHTML = `<button class="onlyMobile" onclick="toggleUCPMenu(this)">
        <i class="fa-solid fa-ellipsis-h"></i>
        <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="accordion">
        ${typeof localUCPLinks !== 'undefined' ? localUCPLinks : jcinkUCPLinks}
    </div>`;

    initAccordion();
    initAccordionActive();

    let textNodes = getAllTextNodesArray(document.querySelectorAll('#UserCP.code-01 #ucpcontent td.pformleft'));
    textNodes.forEach(node => {
        const paragraph = document.createElement('span');
        node.after(paragraph);
        paragraph.appendChild(node);
    });
}
function initAccordionActive() {
    if(pageType === 'Msg') {
        document.querySelectorAll('[data-category="messages"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'UserCP' && (pageClasses.contains('code-alerts') || pageClasses.contains('code-50') || pageClasses.contains('code-26'))) {
        document.querySelectorAll('[data-category="tracking"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'UserCP' && (pageClasses.contains('code-alerts_settings') || pageClasses.contains('code-04') || pageClasses.contains('code-02'))) {
        document.querySelectorAll('[data-category="settings"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'UserCP') {
        document.querySelectorAll('[data-category="account"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'store' && (pageClasses.contains('store-inventory') || pageClasses.contains('store-donate_money') || pageClasses.contains('store-donate_item'))) {
        document.querySelectorAll('[data-category="personal"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'store' && (pageClasses.contains('store-fine') || pageClasses.contains('store-do_edit_points') || pageClasses.contains('store-edit_points') || pageClasses.contains('store-do_staff_inventory') || pageClasses.contains('store-edit_inventory'))) {
        document.querySelectorAll('[data-category="staff"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'store' && pageClasses.contains('store-home')) {
        document.querySelectorAll('[data-category="home"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'store') {
        document.querySelectorAll('[data-category="shop"]').forEach(item => item.classList.add('is-active'));
    }
    if(window.location.search) {
        if(document.querySelector(`#ucpmenu a[href="${window.location.search}"]`)) {
	    document.querySelector(`#ucpmenu a[href="${window.location.search}"]`).classList.add('is-active');
	}
    } else if (document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/usercp/')[1]}"]`)) {
        document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/usercp/')[1]}"]`).classList.add('is-active');
    } else if (document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/store/')[1]}"]`)) {
        document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/store/')[1]}"]`).classList.add('is-active');
    }
}
function cpShift() {
	let imageType = document.querySelector(toggleFields[2]).value,
        powerType = document.querySelector(toggleFields[1]).value,
        account = document.querySelector(toggleFields[0]).value,
	    showFields = [],
	    hideFields = characterFields
                    .concat(aestheticFields['single'].hideFields)
                    .concat(aestheticFields['single'].hideFields)
                    .concat(allLayouts)
                    .concat(powerFields),
	    showHeaders = allHeaders;

	if(account == 'character') {
        showHeaders = allHeaders.concat(charHeaders);
        showFields = characterFields.concat(aestheticFields[imageType].showFields);
        hideFields = aestheticFields[imageType].hideFields;

        if(powerType !== 'powerless' && powerType !== 'unset') {
            showFields = [...showFields, ...powerFields];
        } else {
            hideFields = [...hideFields, ...powerFields];
        }
    }
    
    adjustCP(showFields, hideFields, showHeaders);
}
function adjustCP(show, hide, headers) {
	show.forEach(field => {
		showAccField(field);
	});
	hide.forEach(field => {
		hideAccField(field);
	});
	document.querySelectorAll('thead').forEach(header => {
		header.remove();
	});
    if($('.ucp--section').length > 0) {
        if ( $('.ucp--section tr').parent().is( "tbody" ) ) {
            $('.ucp--section tr').unwrap();
        }
    }
	headers.forEach(header => {
		insertCPHeader(header['sectionTitle'], header['insertBefore'], header['sectionDescription'], header['lastField']);
	});
}
function hideAccField(field) {
	if(document.querySelector(field)) {
		document.querySelector(field).classList.add('hidden');
	}
}
function showAccField(field) {
	if(document.querySelector(field)) {
		document.querySelector(field).classList.remove('hidden');
	}
}
function splitProfile() {
    let headers = $('thead');
    headers.each(function (index, el) {
        if(index == headers.length - 1) {
            $(this).nextUntil('tr:last-child').wrapAll(`<tbody class="ucp--section" data-section="${$(this)[0].dataset.section}"></tbody>`);
        } else {
            $(this).nextUntil('thead').wrapAll(`<tbody class="ucp--section" data-section="${$(this)[0].dataset.section}"></tbody>`);
        }
    });
}
function insertCPHeader (title, field, description) {
    let html = `<thead data-section="${cleanText(title)}"><tr class="ucp--header" data-section="${cleanText(title)}">
        <td>${title}</td>
    </tr>`;
    if(description) {
        html += `<tr class="ucp--description" data-section="${cleanText(title)}">
            <td>${description}</td>
        </tr>`;
    }
    html += `</thead>`;
	$(field).before(html);
}
function ucpAesthetics() {
    let imageObj = {
        'tall-1': document.querySelector('#field_57_input').value,
        'tall-2': document.querySelector('#field_58_input').value,
        'wide-1': document.querySelector('#field_59_input').value,
        'wide-2': document.querySelector('#field_60_input').value,
        'square-1': document.querySelector('#field_61_input').value,
        'square-2': document.querySelector('#field_62_input').value,
        'square-3': document.querySelector('#field_63_input').value,
        'square-4': document.querySelector('#field_64_input').value,
    };
    let aesthetics = document.querySelector('#field_56_input').options[document.querySelector('#field_56_input').selectedIndex].innerText.replace(' ', '');

    let aestheticsSample = document.querySelector('.ucp--description[data-section="Aesthetics"] .sample');
    if(aestheticsSample) {
        aestheticsSample.classList.add(aesthetics.replace(' ', ''));
        aestheticsSample.innerHTML = formatAesthetics(aesthetics, imageObj);
    }
}
function toggleUCPMenu(e) {
    e.closest('#ucpmenu').classList.toggle('is-open');
}

/****** Store ******/
function initStoreMenu() {
    document.querySelector('#ucpmenu').innerHTML = `<div class="accordion">
        ${typeof localStoreLinks !== 'undefined' ? localStoreLinks : jcinkStoreLinks}
    </div>`;

    initAccordion();
    initAccordionActive();
}