const jcinkUCPLinks = `<div class="accordion--trigger" data-category="account"><b>Account</b></div>
        <div class="accordion--content" data-category="account">
            <a href="?act=UserCP&CODE=01">Edit Profile</a>
            <a href="?act=UserCP&CODE=24">Update Avatar</a>
            <a href="?act=UserCP&CODE=54">Sub-accounts</a>
            <a href="?act=UserCP&CODE=52">Edit Username</a>
            <a href="?act=UserCP&CODE=28">Change Password</a>
            <a href="?act=UserCP&CODE=08">Update Email</a>
        </div>
        <div class="accordion--trigger" data-category="messages"><b>Messages</b></div>
        <div class="accordion--content" data-category="messages">
            <a href="?act=Msg&CODE=01">Inbox</a>
            <a href="?act=Msg&CODE=04">Send Message</a>
        </div>
        <div class="accordion--trigger" data-category="tracking"><b>Tracking</b></div>
        <div class="accordion--content" data-category="tracking">
            <a href="?act=UserCP&CODE=alerts">Alerts</a>
            <a href="?act=UserCP&CODE=50">Forums</a>
            <a href="?act=UserCP&CODE=26">Topics</a>
        </div>
        <div class="accordion--trigger" data-category="settings"><b>Settings</b></div>
        <div class="accordion--content" data-category="settings">
            <a href="?act=UserCP&CODE=04">Board</a>
            <a href="?act=UserCP&CODE=alerts_settings">Alerts</a>
            <a href="?act=UserCP&CODE=02">Emails</a>
        </div>`;

const jcinkStoreLinks = `<a href="?act=store" class="accordion--trigger" data-category="home">Home</a>
    <div class="accordion--trigger" data-category="shop"><b>Shop</b></div>
    <div class="accordion--content" data-category="shop">
        <a href="?act=store&code=shop&category=1">Appreciation Badges</a>
        <a href="?act=store&code=shop&category=2">Event Badges</a>
        <a href="?act=store&code=shop&category=3">Personality Badges</a>
        <a href="?act=store&code=shop&category=4">Player Badges</a>
        <a href="?act=store&code=shop&category=6">Premium Features</a>
        <a href="?act=store&code=shop&category=5">Relationship Badges</a>
        <a href="?act=store&code=shop&category=7">Zodiac Badges</a>
    </div>
    <div class="accordion--trigger" data-category="personal"><b>Personal</b></div>
    <div class="accordion--content" data-category="personal">
        <a href="?act=store&CODE=inventory">Inventory</a>
        <a href="?act=store&code=donate_money">Send Money</a>
        <a href="?act=store&code=donate_item">Send Item</a>
    </div>
    <div class="accordion--trigger staffOnly" data-category="staff"><b>Staff</b></div>
    <div class="accordion--content staffOnly" data-category="staff">
        <a href="?act=store&code=fine" class="staffOnly">Fine</a>
        <a href="?act=store&code=edit_points" class="staffOnly">Edit Points</a>
        <a href="?act=store&code=edit_inventory" class="staffOnly">Edit Inventory</a>
    </div>`;
        
const uploads = `uploads2`;
const siteName = `wherethehellis`;
const fileTypes = ['gif', 'jpg', 'jpeg', 'png'];
const defaultSquare = `https://picsum.photos/200`;

const activeResExists = `<blockquote class="fullWidth warning">Uh-oh! That's already reserved. Maybe we can help you find another option - reach out in the Discord for help!</blockquote>`;
const prevResExists = `<blockquote class="fullWidth warning">Uh-oh! You've reserved that before! Reserves at Where the Hell Is are non-renewable. If you don't remember doing this, please reach out to staff via Discord and we can review our records and discuss options with you!</blockquote>`;
const claimExists = `<blockquote class="fullWidth warning">Uh-oh! This is already in play! Maybe we can help you find another option - reach out in the Discord for help!</blockquote>`;

const colors = {
    'tiger': [153, 117, 78],
    'wolf': [88, 92, 98],
    'rabbit': [189, 91, 132],
    'adder': [103, 117, 75],
    'eagle': [119, 157, 164],
    'otter': [162, 147, 118],
    'crow': [95, 89, 117],
    'deer': [149, 155, 127],
    'unicorn': [168, 146, 159],
    'phoenix': [189, 141, 79],
    'dragon': [128, 43, 43],
    'selkie': [38, 104, 117],
}

const markdownSafe = `tag-tab[data-key="#basics"] .scroll, tag-tab[data-key="#powers"] .scroll, tag-tab[data-key="#details"] .scroll, tag-tab[data-key="#plotting"] .scroll`;

const unusable = ['premium species', 'premium group', 'custom complex event', 'custom discord role & icon', 'custom event', 'custom subplot'];

//toggle fields: account type, power type, image type
const toggleFields = ['#field_1_input', '#field_38_input', '#field_56_input'];

const characterFields = ['#field_14', '#field_15', '#field_16', '#field_17', '#field_18', '#field_19', '#field_20', '#field_21', '#field_22', '#field_23', '#field_24', '#field_25', '#field_26', '#field_27', '#field_28', '#field_29', '#field_30', '#field_31', '#field_32', '#field_33', '#field_34', '#field_35', '#field_36', '#field_37', '#field_38', '#field_44', '#field_45', '#field_46', '#field_47', '#field_56', '#field_67', '#field_68', '#field_69'];

const fullWidthFields = ['#field_1', '#field_13', '#field_14', '#field_25', '#field_29', '#field_37', '#field_38', '#field_44', '#field_47', '#field_67', '#field_68', '#field_69', '#field_56'];
const halfWidthFields = ['#field_11', '#field_12', '#field_15', '#field_16', '#field_20', '#field_21', '#field_33', '#field_34', '#field_35', '#field_36', '#field_42', '#field_43', '#field_45', '#field_46', '#field_54', '#field_55', '#field_65', '#field_66', '#field_48', '#field_49', '#field_50', '#field_51', '#field_52', '#field_53'];

const allLayouts = ['#field_57'];
const columnsOnly = ['#field_58'];
const mosaicOnly = ['#field_59', '#field_60'];
const notDefault = ['#field_61', '#field_62'];
const largeOnly = ['#field_63', '#field_64'];

const aestheticImageFields = [...allLayouts, ...columnsOnly, ...mosaicOnly, ...notDefault, ...largeOnly].map(text => `${text}_input`);

const aestheticFields = {
    'single': {
        showFields: allLayouts,
        hideFields: [...columnsOnly, ...mosaicOnly, ...notDefault, ...largeOnly],
    },
    'columns': {
        showFields: [...allLayouts, ...notDefault, ...columnsOnly],
        hideFields: [...mosaicOnly, ...largeOnly],
    },
    'smallmosaic': {
        showFields: [...allLayouts, ...notDefault, ...mosaicOnly],
        hideFields: [...largeOnly, ...columnsOnly],
    },
    'largemosaic': {
        showFields: [...allLayouts, ...notDefault, ...mosaicOnly, ...largeOnly],
        hideFields: [...columnsOnly],
    }
};

const powerFields = ['#field_39', '#field_40', '#field_41', '#field_42', '#field_43'];

const allHeaders = [
    {
        sectionTitle: `Player`,
        insertBefore: '#field_1',
        sectionDescription: `<p>This section is for information about <i>you</i>, the writer! This should be the same as the details on your OOC account for consistency's sake. If something changes, please make sure to update the change on <i>all</i> your accounts for that reason.</p>`,
        
    },
    {
        sectionTitle: `Account Images`,
        insertBefore: '#field_54',
        sectionDescription: `<p>These are mandatory image fields for both OOC and character accounts. The images don't need to be specific sizes as they will crop/resize automatically depending on the size of the viewer's screen. We <i>do</i> ask that you use high-quality images that follow the ratio given in the field, for example a “wide” image should be wider than it is tall.</p>`,
    },
    {
        sectionTitle: `Customization`,
        insertBefore: '#field_65',
        sectionDescription: `<p>These are optional "bonus" spots to customize the popout sidebar for you and you alone! You can use hyperlink HTML (provided below) to add custom links for ease of access, or drop a posting template in the code block for your own convenience- whatever you'd like to do, as it will only affect the profile that it's saved to!</p>
        
        <tag-code>
            <div onclick="highlightCode()" class="copyQuick">copy</div>
            <pre><textarea class="scroll"><a href="URL">text</a></textarea></pre>
        </tag-code>`,
    },
    {
        sectionTitle: `Links`,
        insertBefore: '#field_48',
        sectionDescription: `<p>These are for optional links to further information/resources for your character, or for you as a person on your OOC account! Some things you might include here are links to your development forum/threads, links to playlists, or even to a Pinterest board you've put together. You can even place wanted ads here! Please leave these fields blank if you do not want to use them, and please keep the titles on the shorter side- 1 to 2 words each.</p>`,
    },
];
const charHeaders = [
    {
        sectionTitle: `Basic`,
        insertBefore: '#field_14',
        sectionDescription: `<p>This section is for basic information about your character. All of it is <u>mandatory</u> except for "Partners", "Specs", and "Defining Features" which can be left blank if you choose. Please make sure to read up on the site setting to choose a residence that fits your character's circumstances, and be sure to update their profile if their living arrangement changes at any point!</p>`,
    },
    {
        sectionTitle: `Powers`,
        insertBefore: '#field_38',
        sectionDescription: `<p>This section is specifically for your character's powers, if they have any. If you're unsure which category in the dropdown menu your character's power(s) fall into, feel free to ask a staff member for guidance! Every character should have something selected on the dropdown menu, but only characters with powers will need to actually fill out information about their abilities. As per our rules, we are <i>very</i> open-ended on what powers are allowed on-site, but you <u>must</u> have adequate limitations to balance it out or you will be asked to revise your profile. Again, when in doubt, don't hesitate to open a ticket with staff!</p>`,
    },
    {
        sectionTitle: `Details`,
        insertBefore: '#field_44',
        sectionDescription: `<p>This section includes your character's "Quick Facts" and "Freeform”. The "Quick Facts" are a bullet-point set of notes about your character, and should ideally provide a summary of the most important things to know about them. The "Freeform" content is entirely up to you- while there's no minimum length for it, it should give us another taste of what your character is like. Feel free to reach out in the Discord server for freeform ideas if you find yourself drawing a blank!</p>

        <p>On the other hand, if you happen to hit the character maximum for the freeform, use the "Freeform Overflow" to continue writing. In most cases, however, this field will simply be left blank.</p>

        <p>Most, if not all, of our HTML-based codes in our <a href="https://wherethehellis.jcink.net/index.php?showforum=4" target="_blank">Codebank</a> should work in our freeform.</p>
        
        <p>It is worth noting that these, and most, sections of the application do support some limited markdown options for easier coding. These include ** on either side to bold, _ on either side to italicize, and || on either side to spoiler. Additionally, we have quicker ways to do lists available as markdown. The code is below:</p>
        
        <tag-code>
            <div onclick="highlightCode()" class="copyQuick">copy</div>
            <pre><textarea class="scroll"><tl>+ List Item
            + List Item
            + List Item</tl></textarea></pre>
        </tag-code>`,
    },
    {
        sectionTitle: `Plotting`,
        insertBefore: '#field_69',
        sectionDescription: `<p>This section serves as your "shipper" on-site and should give others a brief summary of your character (a paragraph or two, in the "Overview" field) as well as some ideas for potential plots you're looking for, as well as plots you have no interest in pursuing. Please do not leave either field blank; we ask you provide at <i>least</i> a few solid ideas in the "Plot Hooks" field, and if you are open to any plot types at all, please write that in the "Not Interested" field as well.</p>
        
        <p>For relationships, while you're welcome to leave it blank at first if your character has none, we do consider it a required field that you should keep updated. You can do so with the following codes:</p>
        <div data-type="grid" data-columns="2" data-gap="smsquare" style="margin-top: 30px;">
            <span>
            <div class="h6">No Link, No Image</div>
            <tag-code>
                <div onclick="highlightCode()" class="copyQuick">copy</div>
                <pre><textarea class="scroll"><tag-relationship><b>First Last</b>
                <span>details</span></tag-relationship></textarea></pre>
            </tag-code>
            </span>
            <span>
            <div class="h6">Linked, No Image</div>
            <tag-code>
                <div onclick="highlightCode()" class="copyQuick">copy</div>
                <pre><textarea class="scroll"><tag-relationship><a href="/">First Last</a>
                <span>details</span></tag-relationship></textarea></pre>
            </tag-code>
            </span>
            <span>
            <div class="h6">No Link with Image</div>
            <tag-code>
                <div onclick="highlightCode()" class="copyQuick">copy</div>
                <pre><textarea class="scroll"><tag-relationship><img src="http://picsum.photos/100" />
                <b>First Last</b>
                <span>details</span></tag-relationship></textarea></pre>
            </tag-code>
            </span>
            <span>
            <div class="h6">Linked with Image</div>
            <tag-code>
                <div onclick="highlightCode()" class="copyQuick">copy</div>
                <pre><textarea class="scroll"><tag-relationship><img src="http://picsum.photos/100" />
                <a href="/">First Last</a>
                <span>details</span></tag-relationship></textarea></pre>
            </tag-code>
            </span>
            <span>
            <div class="h6">Title</div>
            <tag-code>
                <div onclick="highlightCode()" class="copyQuick">copy</div>
                <pre><textarea class="scroll"><tag-shiptitle>Text</tag-shiptitle></textarea></pre>
            </tag-code>
            </span>
            <span>
            <div class="h6">Subtitle</div>
            <tag-code>
                <div onclick="highlightCode()" class="copyQuick">copy</div>
                <pre><textarea class="scroll"><tag-shipsubtitle>Text</tag-shipsubtitle></textarea></pre>
            </tag-code>
            </span>
        </div>`,
    },
    {
        sectionTitle: `Aesthetics`,
        insertBefore: '#field_56',
        sectionDescription: `<div class="sample"></div><div class="text"><p>These fields are for your character's "aesthetic" images for their profile. They do not have to be of the character themselves, and can instead be used to give everybody a glance of the character's "aesthetic", whether outfits they would wear, scenery they enjoy, or just general vibes! Please note that Discord does <u>not</u> allow itself to be used as an image host, so none of your profile images should be linked from a Discord server, whether public or private. If you need recommendations for an image host to use, feel free to ask in our Discord server. Any profiles with Discord-linked images will <i>not</i> be accepted until the are hosted elsewhere.</p></div>`,
    },
];
  
/** auto-tracker code by FizzyElf - https://fizzyelf.jcink.net **/
trackerParams = {
    //include
    includeCategoryIds: ['2', '3', '4', '5', '6', '7'],
    includeForumIds: [],
    ignoreForumIds: ['46', '47', '51', '52', '58'],

    //define au, comm, dev, archive forums
    historyForumIds: ['57'], //history
    commForumIds: ['19'], //comm
    commHistoryForumIds: ['55'], //comm history
    socialForumIds: ['20', '21'], //social
    socialHistoryForumIds: ['56'], //social history
    devForumIds: ['8', '9', '10', '11', '12'], //dev
    devHistoryForumIds: ['53'], //dev history
    reqForumIds: ['13', '14', '15', '16', '17'], //requests
    reqHistoryForumIds: ['18'], //request history
    eventForumIds: [], //events
    eventHistoryForumIds: [], //event history

    //set indicators
    indicators: ['fa-solid fa-check', 'fa-solid fa-star'], 
}