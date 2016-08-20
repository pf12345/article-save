/**
 * Created by pengfeng on 15/12/23.
 */
import $ from 'jquery';

const replaceHtmlTag = (html)=> {
    html = $.trim(html).replace(/<br\/>/ig, "<br>").replace(/\n/ig, '').replace(/\r/ig, '');
    html = html.replace(/<div><br><\/div>/ig, "\n");
    html = html.replace(/<br>/ig, "\n").replace(/<div>/ig, "\n").replace(/<p(.*?)>/ig, "\n");
    html = html.replace(/<[^>]*>/ig, '').replace(/&nbsp;/g, " ");
    html = html.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x60;/g, "`");
    return html;
};

const showMsg = ()=> {
    $('#msgBox').html(content).show();
    setTimeout(function () {
        $('#msgBox').html('').fadeOut();
    }, 3000);
};

const common = {
    replaceHtmlTag,
    showMsg
};

export default common;
