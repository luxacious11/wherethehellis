function initTabTemplate(wrapper, labelClass = `tag-labels > tag-label`, tabClass = `tag-tabs > tag-tab`) {
    let labels = wrapper.querySelectorAll(labelClass);
    let tabs = wrapper.querySelectorAll(tabClass);
    labels[0].classList.add('is-active');
    tabs[0].classList.add('is-active');
    labels.forEach(label => {
        label.addEventListener('click', e => {
            let selected = e.currentTarget;
            let tabIndex = Array.from(labels).indexOf.call(labels, selected);
            
            labels.forEach(label => label.classList.remove('is-active'));
            tabs.forEach(tab => tab.classList.remove('is-active'));
            
            selected.classList.add('is-active');
            tabs[tabIndex].classList.add('is-active');
            tabs.forEach(sibling => sibling.style.left = `${-100 * tabIndex}%`);
        });
    });
}
document.querySelectorAll(`[data-type="tabs"]`).forEach(tabset => {
    initTabTemplate(tabset);
});

document.addEventListener( 'DOMContentLoaded', function() {
    document.querySelectorAll(`[data-type="gallery"]`).forEach((gallery) => {
        var splide = new Splide(gallery, {
            type: 'loop',
            speed: '500',
            perPage: 1,
            perMove: 1,
            gap: 0,
            padding: 100,
            easing: 'ease',
            reducedMotion: {
                speed: 0
            }
        });
        splide.mount();
    });
    document.querySelectorAll(`[data-type="socialgallery"]`).forEach((gallery) => {
        let images = gallery.querySelectorAll('tag-image');
        if(images.length === 1) {
            var splide = new Splide(gallery, {
                speed: '500',
                perPage: 1,
                perMove: 1,
                gap: 0,
                padding: 0,
                arrows: false,
                pagination: false,
                easing: 'ease',
                reducedMotion: {
                    speed: 0
                }
            });
            splide.mount();
        } else {
            var splide = new Splide(gallery, {
                type: 'loop',
                speed: '500',
                perPage: 1,
                perMove: 1,
                gap: 0,
                padding: '10%',
                easing: 'ease',
                reducedMotion: {
                    speed: 0
                }
            });
            splide.mount();
        }
    });
});