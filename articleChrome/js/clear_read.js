/*debug function*/

var isPlugin = false;
var serverCss = 'http://file.ireadhome.com/plugins/inote/inote.css';
var exportNextChapter = null //向外部导出的下一章对象
var dbg = (typeof console !== 'undefined') ? function(s) {
        //        console.log("iNote: " + s);
    } : function() {};
(function(iNote, $, undefined) {
    /*start private property*/
    var version = '1.11beta';
    var updateDate = '2014-01-06';
    var bodyCache = null;
    var protectImage = true;
    var bigImageArea = 20000;
    var bigImageScoreRate = 3 / 100000; // 面积/10000 * bigImageScoreRate
    var styleConfig = {
        font: 'yahei',
        fontsize: 1,
        theme: 'gray',
        fontcolor: 'b_gray',
        titleStyle: "h_gray"
    }; //风格配置
    var platform = 1; //平台类型,0:google chrome extension 1:bookmark plugin
    var baseUrl = 'http://www.ireadhome.com';
    var isUsingFlashReader = 0; //是否正在使用阅读器
    /*需要用到的正则表达式*/
    /** @type 需要用到的正则表达式 */
    var regexps = {
        unlikelyCandidates: /combx|comment|community|disqus|extra|foot|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-break|agegate|pagination|pager|popup|tweet|twitter/i,
        okMaybeItsACandidate: /and|article|body|column|main|shadow/i,
        positive: /article|body|content|entry|hentry|main|page|pagination|post|text|blog|story/i,
        negative: /combx|comment|com-|contact|foot|footer|footnote|masthead|media|meta|outbrain|promo|related|scroll|shoutbox|sidebar|sponsor|shopping|tags|tool|widget/i,
        extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single/i,
        divToPElements: /<(a|blockquote|dl|div|img|ol|p|pre|table|ul|br|font)/i,
        replaceBrs: /(<br[^>]*>[ \n\r\t]*){2,}/gi,
        replaceFonts: /<(\/?)font[^>]*>/gi,
        trim: /^\s+|\s+$|\s+/g,
        normalize: /\s{2,}/g,
        killBreaks: /(<br\s*\/?>(\s|&nbsp;?)*){1,}/g,
        videos: /http:\/\/(www\.)?(youtube|vimeo|youku|tudou|sina)\.com/i,
        skipFootnoteLink: /^\s*(\[?[a-z0-9]{1,2}\]?|^|edit|citation needed)\s*$/i,
        nextLink: /(next|weiter|continue|next_page|>([^\|]|$)|([^\|]|$))/i, // Match: next, continue, >, >>, ? but not >|, ?| as those usually mean last.
        prevLink: /(prev|earl|old|new|<|)/i,
        indexLink: /http.*(\\.com\.cn|.net|\.com|\.cn)/
    };

    /** @type 网络资源文件 add by yangsibai 2013-9-17*/
    var source = {
        eraserImg: "http://file.ireadhome.com/static/inote/eraser.png",
        readImg: "http://file.ireadhome.com/static/inote/read.png",
        uploadImg: "http://file.ireadhome.com/static/inote/upload.png",
        reloadImg: "http://file.ireadhome.com/static/inote/reload.png",
        customImg: "http://file.ireadhome.com/static/inote/custom.png",
        nextImg: "http://file.ireadhome.com/static/inote/next.png",
        loadingImg: "http://file.ireadhome.com/static/inote/loading.gif"
    };

    /** @type {Object} 小说网站列表 add by yangsibai 2013-9-18*/
    var sites = {
        qidian: {
            host: "qidian.com",
            novelpattern: /http\:\/\/read\.qidian\.com\/[A-Za-z]+\/[0-9]+\,[0-9]+\.aspx/,
            state: false
        }, //起点中文网 http://read.qidian.com/BookReader/2317087,38875757.aspx
        readnovel: {
            host: "readnovel.com",
            novelpattern: /http\:\/\/www\.readnovel\.com\/novel\/[0-9]+.*\.html/,
            state: false
        }, //小说阅读网 http://www.readnovel.com/novel/222002.html
        hongxiu: {
            host: "hongxiu.com",
            novelpattern: /http\:\/\/novel\.hongxiu\.com\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
            state: false
        }, //红袖添香  http://novel.hongxiu.com/a/741822/7499039.html
        xxsy: {
            host: "xxsy.net",
            novelpattern: /http\:\/\/(www|read)\.xxsy\.net\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
            state: false
        }, //潇湘书院 http://www.xxsy.net/books/519074/5576593.html http://read.xxsy.net/books/455679/4991022.html
        xs8: {
            host: "xs8.cn",
            novelpattern: /http\:\/\/www\.xs8\.cn\/book\/[0-9]+\/[0-9]+\.html/,
            state: false
        }, //小说吧 http://www.xs8.cn/book/174276/162851.html
        jjycw: {
            host: "jjwxc.net",
            novelpattern: /http\:\/\/www\.jjwxc\.net\/.*&.*/,
            state: false
        }, //晋江文学城 http://www.jjwxc.net/onebook.php?novelid=712962&chapterid=1
        sinabook: {
            host: "book.sina.com.cn",
            novelpattern: /http\:\/\/vip\.book\.sina\.com\.cn\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
            state: false
        }, //新浪读书 http://vip.book.sina.com.cn/chapter/240698/388344.html
        hjsm: {
            host: "book.hjsm.tom.com",
            novelpattern: /http\:\/\/book\.hjsm\.tom\.com\/[0-9]+\/[a-z]?[0-9]+\.html/,
            state: false
        }, //幻剑书盟 http://book.hjsm.tom.com/126688/c907707.html
        mmzh: {
            host: "mmzh.com",
            novelpattern: /http\:\/\/(www|book)(\.mmzh|\.zongheng)\.com\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
            state: false
        }, //纵横中文网 http://www.mmzh.com/chapter/281652/4953108.html
        zhulang: {
            host: "book.zhulang.com",
            novelpattern: /http\:\/\/book\.zhulang\.com\/[0-9]+\/[0-9]+\.html/,
            state: false
        }, //逐浪小说网 http://book.zhulang.com/261301/505393.html
        seventeenK: {
            host: "17k.com",
            novelpattern: /http\:\/\/(www|mm)\.17k\.com\/[a-z]+\/[0-9]+\/[0-9]+\.html/,
            state: false
        }, //17k  http://www.17k.com/chapter/588665/11096236.html  http://mm.17k.com/chapter/671522/12960695.html
        lcread: {
            host: "lcread.com",
            novelpattern: /http\:\/\/www\.lcread\.com\/[a-z]+\/[0-9]+\/[0-9]+[a-z]+\.html/,
            state: false
        }, //连城书盟  http://www.lcread.com/bookpage/184116/4535323rc.html
        fmx: {
            host: "read.fmx.cn",
            novelpattern: /http\:\/\/read\.fmx\.cn\/[a-z]+\/[a-z]+\/[a-z]+(\/[0-9]){6,}\/[0-9]+\/[0-9]+\.html/,
            state: false
        }, //凤鸣轩 http://read.fmx.cn/files/article/html/5/9/8/4/3/4/98434/1782441.html
        threeGsc: {
            host: "3gsc.com.cn",
            novelpattern: /http\:\/\/www\.3gsc\.com\.cn\/[a-z]+\/[0-9]+\_[0-9]+\_[0-9]+/,
            state: false
        }, //3G书城  http://www.3gsc.com.cn/bookcon/274409_1_0
        qqbook: {
            host: "book.qq.com",
            novelpattern: /http\:\/\/book\.qq\.com\/.*cid\=[0-9]+.*/,
            state: false
        }, //腾讯文学 http://book.qq.com/read.html?bid=229037&cid=1#bid=229037&cid=2&c_f=&g_f=
        rongshuxia: {
            host: "rongshuxia.com",
            novelpattern: /http\:\/\/www\.rongshuxia\.com\/.*chapterid\-[0-9]+.*/,
            state: false
        }, //榕树下  http://www.rongshuxia.com/chapter/bookid-5879835-chapterid-84975.html
        chuangshi: {
            host: "chuangshi.qq.com",
            novelpattern: /http\:\/\/chuangshi\.qq\.com\/.*m\-[0-9]+.*/,
            state: false
        }, //创世中文网 http://chuangshi.qq.com/read/bk/xianxia/40486960-m-1931989.html
        qwsy: {
            host: "qwsy.com",
            novelpattern: /http\:\/\/www\.qwsy\.com.*cid\=[0-9]+/,
            state: false
        }, //蔷薇书院  http://www.qwsy.com/read.aspx?cid=385110
        qefeng: {
            host: "qefeng.com",
            novelpattern: /http\:\/\/gg\.qefeng\.com\/showchapter\/[0-9]+\/[0-9]+/,
            state: false
        }, //旗峰天下  http://gg.qefeng.com/showchapter/145727/2358
        tiexue: {
            host: "junshishu.com",
            novelpattern: /http\:\/\/www\.junshishu\.com\/Book[0-9]+\/Content[0-9]+\.html/,
            state: false
        }, //铁血中文网  http://www.junshishu.com/Book22994/Content1180878.html//common: {host:"common",novelpattern:""} //普通网站
        motie: {
            host: "motie.com",
            novelpattern: /http\:\/\/www\.motie\.com\/book\/[0-9]+\_[0-9]+/,
            state: false
        } //磨铁http://www.motie.com/book/24840_443346
    };

    /** @type {sites} 当前网站的类型 */
    var thisSiteType = getSiteType(); //获取当前网站的类型
    var isReadNovelSite = getSiteState();

    function getSiteState() {
        var baseUrl = window.location.href;
        for (var key in sites) {
            if (sites[key].novelpattern && baseUrl.search(sites[key].novelpattern) != -1) {
                return true;
            }
        }
        return false;
    };

    var curPageNum = 1; //当前页码
    var maxPageNum = 100; //最多加载的页数
    var parsedPages = {}; //已将转换了的页码
    var curPageLink = document.URL; //当前取到页面的URL,每次加载新页就改变该链接为新页面的链接
    var nextPageLink = null; //下一页的链接
    var isLoadingNextPage = false; //是否正在加载下一页

    var flags = 0x1 | 0x2 | 0x4;

    var FLAG_STRIP_UNLIKELYS = 0x1;
    var FLAG_WEIGHT_CLASSES = 0x2;
    var FLAG_CLEAN_CONDITIONALLY = 0x4;
    var firstEnterState = true; //是否第一次刚进入页面

    var thisBookId;


    var webBook = null; //向外部导出的网站信息及书本信息及当前章内容
    var nextChapter = null; //网站内部使用的下一章对象

    var nextChapterTitle;

    var allImgUrl = [];

    function getWebBook(site, siteName, bookTitle, bookAuthor, chapterArr) {
        var webBook = {
            "site": site,
            "siteName": siteName,
            "bookTitle": bookTitle,
            "bookAuthor": bookAuthor,
            "chapters": chapterArr
        }
        return webBook;
    }

    function getNextChapter(title, content) {
        var nextChapter = {
            chapters: [{
                title: title,
                content: content
            }]
        }
        return nextChapter;
    }

    function getElementsClassName(oParent, className) {
        var classArr = [];
        var oElementsArr = oParent.getElementsByTagName("*");
        for (var i = 0, oElementsArrLen = oElementsArr.length; i < oElementsArrLen; i++) {
            if (oElementsArr[i]) {
                if (oElementsArr[i].className == className) {
                    classArr.push(oElementsArr[i]);
                } else {
                    var classNameArr = oElementsArr[i].className.split(" ");
                    for (var j = 0, classNameArrLen = classNameArr.length; j < classNameArrLen; j++) {
                        if (classNameArr[j] == className) {
                            classArr.push(oElementsArr[i]);
                        }
                    }
                }
            }
        }
        return classArr;
    }
    var site; //本站网址
    var page; //当前页面对象
    var bookTitle; //本书题目
    var bookAuthor; //本书作者
    var thisChapterTitle; //本章标题
    var siteName; //站点名字
    var pageContent; //抓取内容后对象
    var oChapter; //本章对象（包含title,content）
    var chapters = []; //章节数组对象
    var thisChapterContent; //本章内容

    function isIE() { //ie?
        if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 1)
            return true;
        else
            return false;
    }

    if (!isIE()) { //firefox   innerText   define
        HTMLElement.prototype.__defineGetter__("innerText",
            function() {
                var anyString = "";
                var childS = this.childNodes;
                for (var i = 0; i < childS.length; i++) {
                    if (childS[i].nodeType == 1)
                        anyString += childS[i].tagName == "BR" ? '\n' : childS[i].innerText;
                    else if (childS[i].nodeType == 3)
                        anyString += childS[i].nodeValue;
                }
                return anyString;
            }
        );
        HTMLElement.prototype.__defineSetter__("innerText",
            function(sText) {
                this.textContent = sText;
            }
        );
    }

    function getbookInfoContent() {
        switch (thisSiteType) {
            case sites.qidian.host:
                sites.qidian.state = true;
                site = window.location.href.match(regexps.indexLink)[0];
                page = document.body;
                var aI = getElementsClassName(page, "info")[0].getElementsByTagName("i")[0];
                bookTitle = aI.innerText;
                dbg(bookTitle);
                bookAuthor = getElementsClassName(page, "info")[0].getElementsByTagName("i")[1].getElementsByTagName("a")[0].innerHTML;
                thisChapterTitle = document.getElementById("lbChapterName").innerHTML;
                siteName = "起点中文网";
                pageContent = document.getElementById("content");
                removeScripts(pageContent);
                thisChapterContent = pageContent.innerText;
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.readnovel.host:
                sites.readnovel.state = true;
                site = window.location.href.match(regexps.indexLink)[0];
                page = document.body;
                bookTitle = getElementsClassName(document, "autInfo")[0].getElementsByTagName("a")[0].innerHTML;
                bookAuthor = getElementsClassName(document, "autInfo")[0].getElementsByTagName("a")[1].innerHTML;
                thisChapterTitle = getElementsClassName(document, "newContentBody ")[0].children[0].innerHTML;
                siteName = "小说阅读网";
                pageContent = document.getElementById("article");
                thisChapterContent = pageContent.innerText;
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.hongxiu.host:
                sites.hongxiu.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                page = document.body;
                bookTitle = document.getElementById("htmlhdshuming").children[0].innerHTML
                bookAuthor = document.getElementById("htmlzuozhe").innerHTML;
                thisChapterTitle = document.getElementById("htmltimu").innerHTML;
                siteName = "红袖添香小说网";
                pageContent = grabArticle(page);
                thisChapterContent = (pageContent.children[0].innerHTML.replace(/\<p\>/gi, "       ").replace(/\<\/p\>/gi, "\n").replace(/\<span\>|\<\/span\>|\<label\>|\<\/label\>|\<font\>|\<\/font\>/gi, ""));
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.xxsy.host:
                sites.xxsy.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = document.getElementById("detail_title").getElementsByTagName("span")[2].children[0].innerHTML;
                bookAuthor = (document.getElementById("detail_title").getElementsByTagName("span")[1].innerHTML).split("：")[1];
                thisChapterTitle = document.getElementById("detail_title").getElementsByTagName("h1")[0].children[0].innerHTML;
                siteName = "潇湘书院";
                thisChapterContent = document.getElementById("zjcontentdiv").innerText;
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.xs8.host:
                sites.xs8.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                page = document.body;
                bookTitle = document.getElementsByTagName("h1")[0].children[0].innerHTML;
                thisChapterTitle = document.getElementsByTagName("h2")[0].innerHTML;
                siteName = "言情小说吧";
                thisChapterContent = getElementsClassName(document, "chapter_content")[0].innerText;
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                var bookMenuUrl = getElementsClassName(document, "book_list")[0].href;
                chapters.push(oChapter);
                $.get(bookMenuUrl, function(r) {
                    var tempDiv = document.createElement("div");
                    tempDiv.innerHTML = r;
                    bookAuthor = getElementsClassName(tempDiv, "authorbox")[0].children[0].children[0].innerHTML;
                    webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                });
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.jjycw.host:
                sites.jjycw.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = getElementsClassName(document, "noveltitle")[0].getElementsByTagName("span")[0].innerText;
                bookAuthor = getElementsClassName(document, "noveltitle")[0].children[1].innerHTML;
                thisChapterTitle = document.getElementsByTagName("h2")[0].innerHTML;
                siteName = "晋江文学城";
                var pageContent = document.body.innerHTML;
                var tempDiv = document.createElement("div");
                $(tempDiv).html(pageContent);
                var thisChapterContentNode = grabArticle(tempDiv);
                thisChapterContent = thisChapterContentNode.innerText.replace(/\s+/, "      ");
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.sinabook.host:
                sites.sinabook.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = getElementsClassName(document, "subMenu")[0].children[4].innerHTML;
                thisChapterTitle = document.getElementsByTagName("h1")[0].innerHTML;
                siteName = "新浪读书";
                thisChapterContent = document.getElementById("contTxt").innerHTML.replace(/\s+/, "").replace(/\<p\>/gi, "       ").replace(/\<\/p\>/gi, "\n");
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                var bookMenuUrl = getElementsClassName(document, "subMenu")[0].children[4].href;
                $.get(bookMenuUrl, function(r) {
                    var tempDiv = document.createElement("div");
                    tempDiv.innerHTML = r;
                    bookAuthor = getElementsClassName(tempDiv, "Main")[0].children[0].getElementsByTagName("a")[0].innerHTML;
                    webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                })
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.hjsm.host:
                sites.hjsm.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = document.getElementsByTagName("h2")[0].getElementsByTagName("b")[0].children[0].innerHTML;
                thisChapterTitle = getElementsClassName(document, "nr_title")[0].getElementsByTagName("h3")[0].innerHTML;
                siteName = "幻剑书盟";
                var oDivContent = getElementsClassName(document, "nr_con s_b_t_change")[0].innerText;
                thisChapterContent = oDivContent.replace(/\n/gi, "\n    ");
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                var bookMenuUrl = document.getElementsByTagName("h2")[0].getElementsByTagName("b")[0].children[0].href;
                dbg(bookMenuUrl)
                $.get(bookMenuUrl, function(r) {
                    var tempDiv = document.createElement("div");
                    tempDiv.innerHTML = r;
                    bookAuthor = getElementsClassName(tempDiv, "title")[1].getElementsByTagName("span")[1].getElementsByTagName("a")[0].innerHTML;
                    dbg(getElementsClassName(tempDiv, "title")[1].getElementsByTagName("span")[1])
                    webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                })
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.mmzh.host:
                sites.mmzh.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = getElementsClassName(document, "wrap book_reader")[0].getElementsByTagName("span")[0].innerHTML;
                thisChapterTitle = document.getElementsByTagName("h2")[1].innerHTML;
                siteName = "纵横女生网";
                var oDiv = getElementsClassName(document, "book_con")[0];
                var oDivContent = oDiv.innerHTML;
                var tempDiv = document.createElement("div");
                tempDiv.innerHTML = oDivContent;
                var deleteNode = tempDiv.lastChild.previousSibling;
                tempDiv.removeChild(deleteNode);
                var aP = tempDiv.getElementsByTagName("p");
                for (var i = 0, aPLen = aP.length; i < aPLen; i++) {
                    var oSpan = aP[i].getElementsByTagName("span")[0];
                    aP[i].removeChild(oSpan);
                }
                thisChapterContent = tempDiv.innerHTML.replace(/\s+/, "").replace(/\<p\>/gi, "      ").replace(/\<\/p\>/gi, "\n");
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                var bookMenuUrl = getElementsClassName(document, "title")[0].children[7].href;
                $.get(bookMenuUrl, function(r) {
                    var tempDiv = document.createElement("div");
                    tempDiv.innerHTML = r;
                    bookAuthor = getElementsClassName(tempDiv, "book_title")[0].getElementsByTagName("a")[0].innerHTML;
                    webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                })
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.zhulang.host:
                sites.zhulang.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = getElementsClassName(document, "readpage_leftnzgx")[0].getElementsByTagName("a")[0].innerHTML;
                bookAuthor = getElementsClassName(document, "readpage_leftnzgx")[0].getElementsByTagName("a")[1].innerHTML;
                thisChapterTitle = getElementsClassName(document, "readpage_leftntit")[0].innerHTML;
                siteName = "逐浪";
                var divPage = document.getElementById("readpage_leftntxt").innerHTML;
                var oDiv = document.createElement("div");
                oDiv.innerHTML = divPage;
                var deletePNode = oDiv.getElementsByTagName("p")[0];
                oDiv.removeChild(deletePNode);
                thisChapterContent = oDiv.innerText;
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.seventeenK.host:
                sites.seventeenK.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = getElementsClassName(document, "infoPath")[0].getElementsByTagName("font")[0].innerHTML;
                thisChapterTitle = document.getElementsByTagName("h1")[0].innerHTML;
                siteName = "17K小说网";
                var ChapterContent = document.getElementById("chapterContent").innerHTML;
                thisChapterContent = ChapterContent.match(/\<br>.*\<br\>|\<BR>.*\<BR\>/)[0].replace(/\<br\>/ig, "\n");
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                var bookMenuUrl = getElementsClassName(document, "btn right")[0].getElementsByTagName("a")[1].href;
                chapters.push(oChapter);
                $.get(bookMenuUrl, function(r) {
                    var tempDiv = document.createElement("div");
                    tempDiv.innerHTML = r;
                    bookAuthor = getElementsClassName(tempDiv, "directory_title")[0].getElementsByTagName("span")[0].children[0].innerHTML;
                    webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                });
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.lcread.host:
                sites.lcread.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = document.getElementsByTagName("h1")[0].innerHTML;
                thisChapterTitle = document.getElementsByTagName("h2")[0].innerText;
                siteName = "连城书盟";
                var thisChapterContentUrl = window.location.href.replace(/rc\.html/, ".js");

                function getThisInfo() {
                    var thisChapterContent = (tempcontent.replace(/document\.write\(\'/gi, "      ").replace(/&nbsp\;|\'\)\;/gi, "").replace(/(\<br\>)+/gi, "\n      "));
                    dbg(thisChapterContent)
                    dbg(thisChapterTitle)
                    oChapter = {
                        title: thisChapterTitle,
                        content: thisChapterContent
                    };
                    var bookMenuUrlArr = window.location.href.split("/");
                    var bookUrl = "";
                    for (var i = 0, bookMUALen = bookMenuUrlArr.length; i < bookMUALen - 1; i++) {
                        bookUrl += bookMenuUrlArr[i] + "/";
                    }
                    bookUrl += "index.html";
                    chapters.push(oChapter);
                    $.get(bookUrl, function(r) {
                        var tempDiv = document.createElement("div");
                        tempDiv.innerHTML = r;
                        bookAuthor = getElementsClassName(tempDiv, "bri")[0].getElementsByTagName("a")[0].innerHTML;
                        webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                    });
                }
                loadPage(thisChapterContentUrl, getThisInfo);
                break;
            case sites.fmx.host:
                sites.fmx.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                siteName = "凤鸣轩";
                try {
                    bookTitle = getElementsClassName(document, "toptool_left")[0].getElementsByTagName("strong")[0].children[0].innerHTML;
                    bookAuthor = getElementsClassName(document, "toptool_left")[0].getElementsByTagName("span")[0].children[0].innerHTML;
                    thisChapterTitle = getElementsClassName(document, "story_title")[0].innerHTML;
                    var thisChapterContent = document.getElementById("content").innerText;
                    oChapter = {
                        title: thisChapterTitle,
                        content: thisChapterContent
                    };
                    chapters.push(oChapter);
                    webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                } catch (err) {
                    var url = getElementsClassName(document, "nnleft")[0].getElementsByTagName("a")[1].href;
                    bookTitle = getElementsClassName(document, "nnleft")[0].getElementsByTagName("a")[1].innerHTML;
                    thisChapterTitle = getElementsClassName(document, "nnleft")[0].getElementsByTagName("a")[2].innerHTML;
                    var thisChapterContent = document.getElementById("zoom").innerText;
                    oChapter = {
                        title: thisChapterTitle,
                        content: thisChapterContent
                    };
                    chapters.push(oChapter);
                    $.getJSON(baseUrl + '/api/getstringfromurl?callback=?', {
                        url: encodeURIComponent(url)
                    }, function(res) {
                        if (res.code == 0) {
                            var tempDiv = document.createElement("div");
                            tempDiv.innerHTML = res.content;
                            bookAuthor = getElementsClassName(tempDiv, "a_name")[0].innerHTML;
                            var aaa = encodeURIComponent(bookAuthor);
                            webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                        }
                    })
                }
                break;
            case sites.threeGsc.host:
                sites.threeGsc.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = getElementsClassName(document, "nav_little")[0].getElementsByTagName("a")[3].innerHTML;
                thisChapterTitle = getElementsClassName(document, "Article")[0].innerHTML;
                siteName = "3G书城";
                var thisChapterContent = getElementsClassName(document, "menu-area")[0].innerText;
                var bookMenuUrl = document.getElementById("test").getElementsByTagName("a")[0].href;
                $.get(bookMenuUrl, function(r) {
                    var tempDiv = document.createElement("div");
                    tempDiv.innerHTML = r;
                    bookAuthor = getElementsClassName(tempDiv, "author")[0].innerHTML;
                    webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                })
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.qqbook.host:
                sites.qqbook.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = document.getElementById("title").innerText.split("(")[0];
                thisChapterTitle = document.getElementById("chapterTitle").innerText;
                siteName = "腾讯文学";
                var thisChapterContent = document.getElementById("content").innerHTML.replace(/\<p\>/gi, "      ").replace(/\<\/p\>/gi, "");
                bookAuthor = document.getElementById("title").innerText.split("(")[1].replace(")", "");
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.rongshuxia.host:
                sites.rongshuxia.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = getElementsClassName(document, "position")[0].getElementsByTagName("a")[3].innerHTML;
                thisChapterTitle = getElementsClassName(document, "title")[0].getElementsByTagName("strong")[0].firstChild.nodeValue;
                siteName = "榕树下";
                var thisChapterContent = document.getElementById("new_cpt_content").innerHTML.replace(/\s+/gi, "").replace(/\<p\>/gi, "      ").replace(/\<\/p\>/gi, "\n");
                bookAuthor = getElementsClassName(document, "title")[0].getElementsByTagName("sub")[0].children[0].innerHTML;
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.chuangshi.host:
                break;
            case sites.qwsy.host:
                sites.qwsy.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                bookTitle = getElementsClassName(document, "fl")[0].getElementsByTagName("a")[3].innerHTML;
                thisChapterTitle = document.getElementsByTagName("h2")[0].innerHTML;
                siteName = "蔷薇书院";
                var pageContent = document.getElementById("div_readContent").innerHTML;
                var tempDiv = document.createElement("div");
                tempDiv.innerHTML = pageContent;
                var aDiv = tempDiv.getElementsByTagName("div");
                var oChapterAuthorMsgDiv = getElementsClassName(tempDiv, "chapterAuthorMsg")[0];
                var oQwSfDiv = getElementsClassName(tempDiv, "qwSf")[0];
                if (oChapterAuthorMsgDiv) {
                    tempDiv.removeChild(oChapterAuthorMsgDiv);
                }
                if (oQwSfDiv) {
                    tempDiv.removeChild(oQwSfDiv);
                }
                var aP = tempDiv.getElementsByTagName("p");
                for (var i = 0, aPLen = aP.length; i < aPLen - 1; i++) {
                    var oChildNode = aP[i].getElementsByTagName("font")[0];
                    aP[i].removeChild(oChildNode);
                }
                clean(tempDiv, "script");
                var thisChapterContent = tempDiv.innerHTML.replace(/\s+/, "").replace(/\<p\>/gi, "      ").replace(/\<br\>|\<!.*\>/gi, "").replace(/\<\/p\>/gi, "\n");
                bookAuthor = getElementsClassName(document, "readbtsmall borbutton")[0].getElementsByTagName("a")[0].innerHTML;
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.qefeng.host:
                sites.qefeng.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                var oRead_title = getElementsClassName(document, "read_title")[0];
                if (oRead_title) {
                    bookTitle = oRead_title.getElementsByTagName("a")[0].innerHTML;
                    thisChapterTitle = oRead_title.getElementsByTagName("h2")[0].innerHTML;
                    bookAuthor = oRead_title.getElementsByTagName("a")[1].innerHTML;
                }
                siteName = "旗峰天下";
                var thisChapterContent = document.getElementById("divbg").innerText;
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.tiexue.host:
                sites.tiexue.state = true;
                site = window.location.href.match(regexps.indexLink)[0]; //主页地址
                var oContents = document.getElementById("contents");
                if (oContents) {
                    bookTitle = getElementsClassName(oContents, "inforBox")[0].getElementsByTagName("a")[0].innerHTML;
                    bookAuthor = getElementsClassName(oContents, "inforBox")[0].getElementsByTagName("a")[1].innerHTML;
                    thisChapterTitle = oContents.getElementsByTagName("h1")[0].innerText;
                    var thisChapterContent = getElementsClassName(oContents, "p_01")[0].innerHTML.replace(/\s+/, "  ").replace(/\<\/p\>/gi, "\n").replace(/\<p\>/gi, "    ");
                }
                siteName = "铁血读书";
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
            case sites.motie.host:
                sites.motie.state = true;
                site = window.location.href.match(regexps.indexLink)[0];
                bookTitle = document.getElementById("breadcrumb").getElementsByTagName("li")[1].innerText;
                bookAuthor = getElementsClassName(document, "page-info")[0].getElementsByTagName("a")[0].innerText;
                thisChapterTitle = getElementsClassName(document, "title")[0].value;
                siteName = "磨铁中文网";
                thisChapterContent = getElementsClassName(document, "page-content")[0].innerText;
                oChapter = {
                    title: thisChapterTitle,
                    content: thisChapterContent
                };
                chapters.push(oChapter);
                webBook = getWebBook(site, siteName, bookTitle, bookAuthor, chapters);
                break;
        }
    }

    try {
        getbookInfoContent();

        setTimeout(function() {
            dbg(webBook);
        }, 2000);
    } catch (err) {}

    /*end private property*/

    /*start private methods*/

    function removeScripts(doc) {
        var scripts = doc.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].parentNode && scripts[i].id.indexOf('iread') === -1) { //todoyang:改为class
                scripts[i].parentNode.removeChild(scripts[i]);
            }
        }
    }

    /** 禁用所有的样式列表 */

    function removeStyles(doc) {
        //$('link[rel=stylesheet][href~="ireadhome.com"]').attr("disabled","true");
        for (var i = document.styleSheets.length - 1; i >= 0; i--) {
            if (document.styleSheets[i] !== null) {
                if (document.styleSheets[i].href && document.styleSheets[i].href.match("ireadhome")) {
                    continue;
                }
                document.styleSheets[i].disabled = true;
            }
        }
    }

    /**
     * 获取工具栏
     * @return {[type]}
     */

    /*初始化左边工具栏*/

    function getArticleTools() {
        var articleTools = document.createElement("DIV");
        articleTools.id = "readTools";
        articleTools.className = 'article_tool';
        var articleTools_content = document.createElement("div");
        articleTools_content.id = "articleTools_content";
        articleTools_content.className = "articleTools_content";
        var iNote_logo = document.createElement("div");
        iNote_logo.setAttribute("style", "height:48px;width:100px;line-height: 48px;padding-top: 6px;color:#5a4534");
        var oA = document.createElement("a");
        oA.href = "http://www.ireadhome.com/iNote";
        oA.target = "_blank";
        var logo_img = document.createElement("img");
        logo_img.style.float = "left";
        logo_img.style.marginTop = "15px";
        logo_img.style.border = "none";
        logo_img.src = "http://www.ireadhome.com/Content/Images/Home/iNote_collect.png?101";
        oA.appendChild(logo_img);
        iNote_logo.appendChild(oA);
        var toolHtml = ['<ul class="article_list" style="list-style: none">',
            '<li id="inote_index"><a target="_blank" href="http://www.ireadhome.com/Magazine" title="我的" class="icon i_index"></a><i class="help_explain_i" style="width: 85px"><b></b>查看我的转载</i></li>',
            '<li><a href="javascript:window.location.reload();" class="icon i_source" title="原文"></a><i class="help_explain_i" style="width: 30px"><b></b>原文</i></li>',
            '<li class="set_style">',
            '<i class="help_explain_i" style="width: 30px"><b></b>设置</i>',
            '<a href="#" class="icon i_set" title="设置"></a>',
            '<ul class="set_all" style="list-style: none;display: none">',
            '<p class="article_menu_top"></p>',
            '<i class="tri"></i>',
            '<li class="set_font" style="list-style: none">',
            '<span>字体</span>',
            '<ul style="list-style: none">',
            '<li data-font="yahei"><i class="old_icon i_select"></i>微软雅黑</li>',
            '<li data-font="kaiti" class="kaiti"><i class="old_icon"></i>楷体</li>',
            '<li data-font="simsun" class="songti" style="font-size: 13px"><i class="old_icon"></i>宋体</li>',
            '</ul>',
            '</li>',
            '<li class="set_size" data-size="0">',
            '<span>字号</span>',
            '<i class="old_icon i_fontminus" title="减小"></i>',
            '<i class="old_icon i_fontplus" title="增大"></i>',
            '</li>',
            '<li class="set_theme">',
            '<span>主题</span>',
            '<i class="icon i_gray" style="border: 1px solid #FD6C0D" title="茶白"></i>',
            '<i class="icon i_black" title="静黑"></i>',
            '<i class="icon i_yellow" title="暖棕"></i>',
            '<i class="icon i_green" title="幕灰"></i>',
            '</li>',
            '<li style="border-bottom: none"></li>',
            '</ul>',
            '</li>',
            '<li id="inote_save"><a href="javascript:void(0);" title="保存" class="icon i_scollect"></a><i class="help_explain_i" id="help_explain_save" style="width: 30px"><b></b>保存</i></li>'
            //            '<li id="inote_img_save"><a href="javascript:void(0);" title="抓取图片" class="icon i_save"></a></li>'
        ];
        if (isReadNovelSite) {
            toolHtml.push('<li id="inote_reader"><a href="javascript:void(0);" title="阅读器" class="icon i_read"></a><i class="help_explain_i" style="width: 44px"><b></b>阅读器</i></li>');
        }
        toolHtml.push('<li style="position: relative"  id="inote_phone">',
            '<i class="help_explain_i" style="width: 71px"><b></b>手机端下载</i>',
            '<a href="javascript:void(0)" title="手机端下载" class="icon i_phone"></a>',
            '<div class="i_code">',
            '<p class="article_menu_top"></p>',
            '<i class="tri"></i>',
            '<p style="margin-top: 23px">扫描二维码下载</p>',
            '<img src="http://file.ireadhome.com/static/inote/dimencode.jpg" alt="iNote二维码"/>',
            '<p>',
            '<a target="_blank" href="http://www.ireadhome.com/iNote">查看介绍</a>',
            '</p>',
            '</div>',
            '</li>',
            '<li id="inote_help"><a target="_blank" title="使用指南" class="icon i_help"></a>' +
            '<i class="help_explain_i" style="width: 60px"><b></b>使用指南</i></li>');
        toolHtml.push('</ul>');
        articleTools_content.innerHTML = toolHtml.join('');
        articleTools_content.appendChild(iNote_logo);
        articleTools.appendChild(articleTools_content);
        return articleTools;
    }

    /*帮助指南*/

    function helpExplain() {
        var help_explain_mc = document.createElement("div");
        help_explain_mc.className = "help_explain_mc";
        help_explain_mc.id = "help_explain_mc";
        document.body.appendChild(help_explain_mc);
        var help_explain_mc_close = document.createElement("b");
        help_explain_mc_close.className = "help_explain_mc_close";
        help_explain_mc_close.id = "help_explain_mc_close";
        help_explain_mc.appendChild(help_explain_mc_close);
        var more_help = document.createElement("p");
        more_help.className = "more_help";
        more_help.id = "more_help";
        more_help.innerHTML = "<div class='more_help_title'>" +
            "<div class='logo'>" +
            "<img style='position: relative;top: 9px;left: 13px' src='http://www.ireadhome.com/Content/Images/Home/iNote_collect.png' alt='logo' />" +
            "</div>" +
            "</div>" +
            "<div style='margin-left: 36px'>你已经看到了纯净的网页，接下来，<br>" +
            "点击上面的按钮，你就可以保存了。<br><br>" +
            "需要更多帮助，" +
            "<a style='text-decoration: underline' target='_blank' href='http://www.ireadhome.com/About/ContactUs'>请联系我们</a>" +
            "</div>" +
            "<p>" +
            "<input id='btn_help_close' class='button_two_font' type='button' value='确定'>" +
            "</p>";
        document.body.appendChild(more_help);
        $(".help_explain_i").each(function() {
            $(this).show();
        });
    }

    /*关闭帮助指南界面*/

    function helpExplainClose() {
        var help_explain_mc = document.getElementById("help_explain_mc");
        var help_explain_mc_close = document.getElementById("help_explain_mc_close");
        var more_help = document.getElementById("more_help");
        if (help_explain_mc && help_explain_mc_close) {
            help_explain_mc.removeChild(help_explain_mc_close);
            document.body.removeChild(more_help);
            document.body.removeChild(help_explain_mc);

        }
        $(".help_explain_i").each(function() {
            $(this).hide();
        });
        inote_help_state = false;
    }

    /*获取文章的标题*/

    function getArticleTitle(title) {
        var curTitle = "",
            origTitle = "";

        try {
            curTitle = origTitle = (title !== null) ? document.title : title;

            if (typeof curTitle !== "string") { /* If they had an element with id "title" in their HTML */
                curTitle = origTitle = getInnerText(document.getElementsByTagName('title')[0]); //获取网页title标签内容
            }
        } catch (e) {}

        if (curTitle.match(/ [\|\-] /)) {
            curTitle = origTitle.replace(/(.*)[\|\-] .*/gi, '$1');

            if (curTitle.split(' ').length < 3) {
                curTitle = origTitle.replace(/[^\|\-]*[\|\-](.*)/gi, '$1');
            }
        } else if (curTitle.indexOf(': ') !== -1) {
            curTitle = origTitle.replace(/.*:(.*)/gi, '$1');

            if (curTitle.split(' ').length < 3) {
                curTitle = origTitle.replace(/[^:]*[:](.*)/gi, '$1');
            }
        } else if (curTitle.length > 150 || curTitle.length < 15) {
            var hOnes = document.getElementsByTagName('h1');
            if (hOnes.length === 1) {
                curTitle = getInnerText(hOnes[0]);
            }
        }

        curTitle = curTitle.replace(regexps.trim, "");

        if (curTitle.split(' ').length <= 4) {
            curTitle = origTitle;
        }

        var articleTitle = document.createElement("H1");
        articleTitle.className = styleConfig.titleStyle;
        articleTitle.innerHTML = curTitle;

        return articleTitle;
    }

    /*loading 图*/

    function getArticleLoading() {
        var loading = document.createElement("DIV");
        loading.id = "inote-loading";
        loading.innerHTML = '<img src="' + source.loadingImg + '" />';
        return loading;
    }
    /** 抽取文章内容 */

    function grabArticle(page) {
        var stripUnlikelyCandidates = flagIsActive(FLAG_STRIP_UNLIKELYS);
        var isPaging = (page !== null) ? true : false;
        page = page ? page : document.body; //如果没有传值，使用当前页面
        var pageCacheHtml = page.innerHTML; //页面缓存
        var allElements = page.getElementsByTagName('*'); //得到页面所有元素

        for (var i = 0; i < allElements.length; i++) {
            var node = allElements[i];
            if (node.tagName == "SCRIPT") {
                node.parentNode.removeChild(node);
            }
        }
        /**
         * 准备节点，将所有垃圾节点去除，将DIV标签转换为P标签
         **/
        var node = null;
        var nodesToScore = []; //可用节点数组

        for (var i = 0; i < allElements.length; ++i) {
            // Remove unlikely candidates */
            var continueFlag = false;
            node = allElements[i]; //提取所有节点中的第i个
            if (node.style.display == "none") {
                node.parentNode.removeChild(node);
                continueFlag = true;
                continue;
            }
            if (node.tagName == "STYLE") {
                node.parentNode.removeChild(node);
                continueFlag = true;
                continue;
            }
            if (node.tagName == "SCRIPT") {
                node.parentNode.removeChild(node);
                continueFlag = true;
                continue;
            }
            var unlikelyMatchString = node.className + node.id;
            if (unlikelyMatchString.search(regexps.unlikelyCandidatesRe) !== -1 && unlikelyMatchString.search(regexps.okMaybeItsACandidateRe) == -1 && node.tagName !== "BODY") {
                dbg("移除unlikly节点 - " + unlikelyMatchString);
                node.parentNode.removeChild(node);
                continueFlag = true;
            }

            if (!continueFlag && (node.tagName === 'P' || node.tagName === 'TD' || node.tagName === 'PRE')) {
                nodesToScore[nodesToScore.length] = node;
            }
            /*提取理论上可用大图片*/
            if (protectImage && !continueFlag && node.tagName === 'IMG' && elementVisible(node)) {
                var _width = node.width,
                    _height = node.height;
                var imgArea = _width * _height;
                if (imgArea > bigImageArea || (_width >= 150) && (_height >= 150)) {
                    dbg("一个不错的图片节点：" + node);
                    nodesToScore[nodesToScore.length] = node;
                    continue;
                } else {
                    node.parentNode.removeChild(node); //将小图片等无用图片全部清除
                    continue;
                }
            }
            /*如果a标签占节点一半以上，删除节点*/
            var linkRate = getLinkRate(node);
            if (linkRate < 2) {
                node.parentNode.removeChild(node);
                continue;
            }
            // Turn all divs that don't have children block level elements into p's
            if (!continueFlag && node.tagName === "DIV") {
                if (node.innerHTML.search(regexps.divToPElements) === -1) {
                    //                    dbg("将 div 标签转换为 p");
                    var newNode = document.createElement('p');
                    try {
                        newNode.innerHTML = node.innerHTML;
                    } catch (err) {
                        var nodeArr = node.childNodes;
                        for (var i = 0, nodeArrLen = nodeArr.length; i < nodeArrLen; i++) {
                            if (nodeArr[i]) {
                                newNode.appendChild(nodeArr[i]);
                            }
                        }
                    }
                    node.parentNode.replaceChild(newNode, node);
                    nodesToScore[nodesToScore.length] = newNode;
                } else {
                    for (var j = 0, jl = node.childNodes.length; j < jl; j += 1) {
                        var childNode = node.childNodes[j];
                        /*如果为文本节点*/
                        if (childNode.nodeType === 3) {
                            var span = document.createElement('p');
                            span.innerHTML = childNode.nodeValue;
                            childNode.parentNode.replaceChild(span, childNode);
                        }
                    }
                }
            }
        }
        /**
         * Loop through all paragraphs, and assign a score to them based on how content-y they look.
         * Then add their score to their parent node.
         *
         * A score is determined by things like number of commas, class names, etc. Maybe eventually link density.
         **/
        var candidates = [];
        for (var i = 0, _i = nodesToScore.length; i < _i; ++i) {
            var node = nodesToScore[i];
            var parentNode = node.parentNode;
            if (parentNode === null) continue; //todoyang:这里有问题，不应该有这个判断
            var grandParentNode = parentNode.parentNode;
            var innerText = getInnerText(node);
            var isGoodImg = node.tagName === 'IMG' && protectImage; //是否是图片
            if (!isGoodImg && escape(innerText).indexOf("%u") >= 0 && innerText.length < 10) { //包含中文且少于10个字
                dbg("包含中文且少于10个字，跳过：=>" + innerText);
                continue;
            } else if (!isGoodImg && escape(innerText).indexOf("%u") < 0 && innerText.length < 25) { //不包含中文但少于25个字
                //                dbg("不包含中文但少于25个字=>" + innerText);
                continue;
            }
            // Initialize readability data for the parent.
            if (typeof parentNode.readability == 'undefined') {
                initializeNode(parentNode);
                candidates.push(parentNode);
            }

            // Initialize readability data for the grandparent.
            if (grandParentNode && typeof grandParentNode.readability == 'undefined') {
                initializeNode(grandParentNode);
                candidates.push(grandParentNode);
            }

            //基础分数
            var contentScore = 1;

            if (isGoodImg) {
                var singleImgArea = node.width * node.height;
                var imgScore = bigImageScoreRate * singleImgArea;
                contentScore += imgScore;
                dbg("不错的图片，加分=>" + imgScore);
            }

            // Add points for any commas within this node */
            // support Chinese commas.支持中文逗号
            contentScore += innerText.replace('，', ',').split(',').length;

            // For every 100 characters in this node, add another point. Up to 3 points. */
            // adjust by yangsibai at 2013-9-24 100=>20
            contentScore += Math.min(Math.floor(innerText.length / 20), 3);

            //将分数加给父节点，祖父节点获取一半的分数
            parentNode.readability.contentScore += contentScore;
            if (grandParentNode) {
                grandParentNode.readability.contentScore += contentScore / 2;
            }

        }
        /**
         * After we've calculated scores, loop through all of the possible candidate nodes we found
         * and find the one with the highest score.
         **/
        var topCandidate = null;
        for (var c = 0, cl = candidates.length; c < cl; c += 1) {
            /**
             * Scale the final candidates score based on link density. Good content should have a
             * relatively small link density (5% or less) and be mostly unaffected by this operation.
             * 根据链接密度计算分数
             **/
            var node = candidates[c];
            var linkDensity = getLinkDensity(node);
            if (linkDensity && linkDensity > 0) {
                node.readability.contentScore = node.readability.contentScore * (1 - getLinkDensity(node));
            }
            dbg('Candidate: ' + node + " (" + node.className + ":" + node.id + ") with score " + node.readability.contentScore);
            if (!topCandidate || node.readability.contentScore > topCandidate.readability.contentScore) {
                topCandidate = node;
            }
        }

        /**
         * If we still have no top candidate, just use the body as a last resort.
         * We also have to copy the body node so it is something we can modify.
         **/
        if (topCandidate === null || topCandidate.tagName === "BODY") {
            topCandidate = document.createElement("DIV");
            topCandidate.innerHTML = page.innerHTML;
            page.innerHTML = "";
            page.appendChild(topCandidate);
            initializeNode(topCandidate);
        }

        /**
         * Now that we have the top candidate, look through its siblings for content that might also be related.
         * Things like preambles, content split by ads that we removed, etc.
         **/
        var articleContent = document.createElement("DIV");
        var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2);
        var siblingNodes = topCandidate.parentNode.childNodes;


        for (var s = 0, sl = siblingNodes.length; s < sl; s += 1) {
            var siblingNode = siblingNodes[s];
            var append = false;
            /**
             * Fix for odd IE7 Crash where siblingNode does not exist even though this should be a live nodeList.
             * Example of error visible here: http://www.esquire.com/features/honesty0707
             **/
            if (!siblingNode) {
                continue;
            }

            dbg("Looking at sibling node: " + siblingNode + " (" + siblingNode.className + ":" + siblingNode.id + ")" + ((typeof siblingNode.readability !== 'undefined') ? (" with score " + siblingNode.readability.contentScore) : ''));
            dbg("Sibling has score " + (siblingNode.readability ? siblingNode.readability.contentScore : 'Unknown'));

            if (siblingNode === topCandidate) {
                append = true;
            }

            var contentBonus = 0;
            /* Give a bonus if sibling nodes and top candidates have the example same classname */
            /*如果兄弟节点跟top节点有同样的className,加 20%分 */
            if (siblingNode.className === topCandidate.className && topCandidate.className !== "") {
                contentBonus += topCandidate.readability.contentScore * 0.2;
            }

            if (typeof siblingNode.readability !== 'undefined' && (siblingNode.readability.contentScore + contentBonus) >= siblingScoreThreshold) {
                append = true;
            }

            if (siblingNode.nodeName === "P") {
                var linkDensity = getLinkDensity(siblingNode);
                var nodeContent = getInnerText(siblingNode);
                var nodeLength = nodeContent.length;

                if (nodeLength > 80 && linkDensity < 0.25) {
                    append = true;
                } else if (nodeLength < 80 && linkDensity === 0 && nodeContent.search(/\.( |$)/) !== -1) {
                    append = true;
                }
            }

            if (append) {
                dbg("Appending node: " + siblingNode);
                var nodeToAppend = null;
                if (siblingNode.nodeName !== "DIV" && siblingNode.nodeName !== "P") {
                    /* We have a node that isn't a common block level element, like a form or td tag. Turn it into a div so it doesn't get filtered out later by accident. */

                    dbg("Altering siblingNode of " + siblingNode.nodeName + ' to div.');
                    nodeToAppend = document.createElement("DIV");
                    try {
                        nodeToAppend.id = siblingNode.id;
                        nodeToAppend.innerHTML = siblingNode.innerHTML;
                        if (sites.xs8.state) {
                            nodeToAppend.innerHTML += "<br>"
                        }
                    } catch (er) {
                        dbg("Could not alter siblingNode to div, probably an IE restriction, reverting back to original.");
                        nodeToAppend = siblingNode;
                        s -= 1;
                        sl -= 1;
                    }
                } else {
                    nodeToAppend = siblingNode;
                    //对于言情小说吧中添加换行
                    if (sites.xs8.state) {
                        var brArr = nodeToAppend.getElementsByTagName("p")[3].getElementsByTagName("br");
                        for (var i = 0, brArrLen = brArr.length; i < brArrLen - 1; i++) {
                            var oBrNode = document.createElement("p");
                            brArr[i].appendChild(oBrNode)
                        }
                    }
                    s -= 1;
                    sl -= 1;
                }

                /* To ensure a node does not interfere with readability styles, remove its classnames */
                nodeToAppend.className = "";

                /* Append sibling and subtract from our list because it removes the node when you append to another node */
                articleContent.appendChild(nodeToAppend);
            }
        }
        prepArticle(articleContent);
        specialDealwith(articleContent); //特殊处理，去广告等
        /*将为相对路径的图片改为绝对路径*/
        var aImg = articleContent.getElementsByTagName("img");
        for (var i = 0, aImgLen = aImg.length; i < aImgLen; i++) {
            if (aImg[i]) {
                var tempSrc = aImg[i].src;
                aImg[i].setAttribute("src", tempSrc);
                tempSrc = null;
                if (aImg[i].height) {
                    aImg[i].removeAttribute("height");
                }
                if (aImg[i].style.height) {
                    aImg[i].style.height = "auto";
                }
            }
        }
        return articleContent;
    };

    /**
     * 获取文章footer,iread 版权声明 add by yangsibai 2013-9-23
     * @return 版权声明footer div
     */

    /*在页脚创建版权声明*/

    function getArticleFooter() {
        var articleFooter = document.createElement("DIV");
        articleFooter.id = "inote-footer";
        articleFooter.className = 'footer';
        articleFooter.innerHTML = [
            "<div class='footer-right'>",
            "<a href='http://www.ireadhome.com' target='_blank' class='footer-ireadlink'>powered by iread &raquo;</a>",
            "<span class='version'>version " + version + "</span>",
            "</div>",
            "</div>"
        ].join('');
        return articleFooter;
    };

    /**
     * 显示消息提示
     * @param  消息内容
     * @param  多少秒后隐藏
     * @return void
     */

    function showMessage(msg, time) {
        if (!time || time <= 0) time = 3;
        var msgId = "inote_message_box";
        var box = document.getElementById(msgId);
        if (!box) { //还没有消息框
            box = document.createElement("div");
            box.id = msgId;
            document.body.appendChild(box);
        } else {
            box.style.display = "block";
        }
        box.innerHTML = '<p>' + msg + '</p>';
        $('#' + msgId).fadeIn();
        setTimeout(function() {
            $('#' + msgId).fadeOut();
        }, time * 1000);
    };

    /**
     * 检测flag是否启用
     * @param  flag
     * @return true/false
     */

    function flagIsActive(flag) {
        return (flags & flag) > 0;
    };

    function getInnerText(e, normalizeSpaces) {
        var textContent = "";

        if (typeof(e.textContent) === "undefined" && typeof(e.innerText) === "undefined") {
            return "";
        }

        normalizeSpaces = (typeof normalizeSpaces === 'undefined') ? true : normalizeSpaces; //若传参，则提取参数，不传参，则等于true

        if (navigator.appName === "Microsoft Internet Explorer") {
            textContent = e.innerText.replace(regexps.trim, "");
        } else {
            textContent = e.textContent.replace(regexps.trim, "");
        }

        if (normalizeSpaces) {
            return textContent.replace(regexps.normalize, " ");
        } else {
            return textContent;
        }
    };

    /**
     * Initialize a node with the readability object. Also checks the
     * className/id for special names to add to its score.
     * 使用readability对象初始化节点，同时检查特殊的class名操作分数
     * @param Element
     * @return void
     **/

    function initializeNode(node) {
        node.readability = {
            "contentScore": 0
        };

        switch (node.tagName) {
            case 'DIV':
                node.readability.contentScore += 5;
                break;
            case 'PRE':
            case 'TD':
            case 'BLOCKQUOTE':
                node.readability.contentScore += 3;
                break;
            case 'ADDRESS':
            case 'OL':
            case 'UL':
            case 'DL':
            case 'DD':
            case 'DT':
            case 'LI':
            case 'FORM':
                node.readability.contentScore -= 3;
                break;
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':
            case 'TH':
                node.readability.contentScore -= 5;
                break;
        }

        node.readability.contentScore += getClassWeight(node);
    }

    /*获取一个class的分数*/

    function getClassWeight(e) {
        if (!flagIsActive(FLAG_WEIGHT_CLASSES)) {
            return 0;
        }

        var weight = 0;

        /* Look for a special classname */
        if (typeof(e.className) === 'string' && e.className !== '') {
            if (e.className.search(regexps.negative) !== -1) {
                weight -= 25;
            }

            if (e.className.search(regexps.positive) !== -1) {
                weight += 25;
            }
        }

        /* 查找特殊的ID */
        if (typeof(e.id) === 'string' && e.id !== '') {
            if (e.id.search(regexps.negative) !== -1) {
                weight -= 25;
            }

            if (e.id.search(regexps.positive) !== -1) {
                weight += 25;
            }
        }

        return weight;
    };

    /*获取链接密度*/

    function getLinkDensity(e) {
        var links = e.getElementsByTagName("a");
        var textLength = getInnerText(e).length; //e中内容长度
        var linkLength = 0; //e中a标签内容长度
        for (var i = 0, il = links.length; i < il; i += 1) {
            linkLength += getInnerText(links[i]).length;
        }

        return linkLength / textLength;
    };

    /*节点中链接比例*/

    function getLinkRate(e) {
        var links = $(e).children("a"),
            _links_len = links.length;
        var nodes = $(e).children(),
            _nodes_len = nodes.length;
        return (_links_len > 1 && _nodes_len > 1) ? _nodes_len / _links_len : 2;
    }
    /*准备文章内容*/

    function prepArticle(articleContent) {
        cleanStyles(articleContent); //清除样式
        killBreaks(articleContent); //清除换行

        /* Clean out junk from the article content */
        cleanConditionally(articleContent, "form");
        clean(articleContent, "object");
        clean(articleContent, "h1");

        /**
         * If there is only one h2, they are probably using it
         * as a header and not a subheader, so remove it since we already have a header.
         ***/
        if (articleContent.getElementsByTagName('h2').length === 1) {
            clean(articleContent, "h2");
        }
        clean(articleContent, "iframe");

        cleanHeaders(articleContent);

        /* Do these last as the previous stuff may have removed junk that will affect these */
        cleanConditionally(articleContent, "table");
        cleanConditionally(articleContent, "ul");
        cleanConditionally(articleContent, "div");

        //dbg("正在准备文章："+articleContent.innerHTML);
        /* Remove extra paragraphs */
        var articleParagraphs = articleContent.getElementsByTagName('p');
        for (var i = articleParagraphs.length - 1; i >= 0; i -= 1) {
            var imgCount = articleParagraphs[i].getElementsByTagName('img').length;
            var embedCount = articleParagraphs[i].getElementsByTagName('embed').length;
            var objectCount = articleParagraphs[i].getElementsByTagName('object').length;

            if (imgCount === 0 && embedCount === 0 && objectCount === 0 && getInnerText(articleParagraphs[i], false) === '') {
                articleParagraphs[i].parentNode.removeChild(articleParagraphs[i]);
            }
        }
        cleanSingleHeader(articleContent);

        try {
            articleContent.innerHTML = articleContent.innerHTML.replace(/<br[^>]*>\s*<p/gi, '<p');
        } catch (e) {
            dbg("清理换行失败，IE bug，忽略：" + e);
        }
        return articleContent;
    }

    /*清理所有css样式*/

    function cleanCssStyle() {
        var aLink = document.getElementsByTagName("link");
        dbg(aLink);
        for (var i = 0, aLinkLen = aLink.length; i < aLinkLen; i++) {
            if (aLink[i]) aLink[i].parentNode.removeChild(aLink[i]);
        }
    }
    /*清理元素的style*/

    function cleanStyles(e) {
        e = e || document;
        var cur = e.firstChild;
        if (!e) {
            return;
        }

        // Remove any root styles, if we're able.
        if (typeof e.removeAttribute === 'function' && e.className !== 'iread_style') {
            e.removeAttribute('style');
            e.removeAttribute('align');
        }
        // Go until there are no more child nodes
        while (cur !== null && cur !== undefined) {
            if (cur.nodeType === 1) {
                // Remove style attribute(s) :
                if (cur.className !== "iread_style") {
                    cur.removeAttribute("style");
                    cur.removeAttribute('class');
                }
                cleanStyles(cur);
            }
            cur = cur.nextSibling;
        }
    }

    /*清理换行*/

    function killBreaks(e) {
        try {
            e.innerHTML = e.innerHTML.replace(regexps.killBreaks, '<br />');
        } catch (eBreaks) {
            dbg("KillBreaks failed - this is an IE bug. Ignoring.: " + eBreaks);
        }
    };

    /**
     * Clean an element of all tags of type "tag" if they look fishy.
     * "Fishy" is an algorithm based on content length, classnames, link density, number of images & embeds, etc.
     *
     * @return void
     **/

    function cleanConditionally(e, tag) {

        if (!flagIsActive(FLAG_CLEAN_CONDITIONALLY)) {
            return;
        }

        var tagsList = e.getElementsByTagName(tag);
        var curTagsLength = tagsList.length;

        /**
         * Gather counts for other typical elements embedded within.
         * Traverse backwards so we can remove nodes at the same time without effecting the traversal.
         *
         * TODO: Consider taking into account original contentScore here.
         **/
        for (var i = curTagsLength - 1; i >= 0; i -= 1) {
            var weight = getClassWeight(tagsList[i]);
            var contentScore = (typeof tagsList[i].readability !== 'undefined') ? tagsList[i].readability.contentScore : 0;
            dbg("Cleaning Conditionally " + tagsList[i] + " (" + tagsList[i].className + ":" + tagsList[i].id + ")" + ((typeof tagsList[i].readability !== 'undefined') ? (" with score " + tagsList[i].readability.contentScore) : ''));

            //todoyang:是否可以使用中文逗号?
            if (weight + contentScore < 0) {
                tagsList[i].parentNode.removeChild(tagsList[i]);
            } else if (getCharCount(tagsList[i], ',') < 10 || getCharCount(tagsList[i], '，') < 10) {
                /**
                 * If there are not very many commas, and the number of
                 * non-paragraph elements is more than paragraphs or other ominous signs, remove the element.
                 **/
                var mustProtectImage = false;
                var imgs = tagsList[i].getElementsByTagName('img');
                for (var j = 0; j < imgs.length; j++) {
                    var singleImg = imgs[j];
                    if (singleImg.width >= 0 || singleImg.height >= 0) {
                        //toRemove = false; //不要移除掉大图片
                        mustProtectImage = true;
                    }
                }
                if (!mustProtectImage && protectImage) {
                    var p = tagsList[i].getElementsByTagName("p").length;
                    var img = imgs.length;
                    var li = tagsList[i].getElementsByTagName("li").length - 100;
                    var input = tagsList[i].getElementsByTagName("input").length;

                    var embedCount = 0;
                    var embeds = tagsList[i].getElementsByTagName("embed");
                    for (var ei = 0, il = embeds.length; ei < il; ei += 1) {
                        if (embeds[ei].src.search(regexps.videos) === -1) {
                            embedCount += 1;
                        }
                    }

                    var linkDensity = getLinkDensity(tagsList[i]);
                    var contentLength = getInnerText(tagsList[i]).length;
                    var toRemove = false;

                    if (img > p) {
                        toRemove = true;
                    } else if (li > p && tag !== "ul" && tag !== "ol") {
                        toRemove = true;
                    } else if (input > Math.floor(p / 3)) {
                        toRemove = true;
                    } else if (contentLength < 25 && (img === 0 || img > 2)) {
                        toRemove = true;
                    } else if (weight < 25 && linkDensity > 0.2) {
                        toRemove = true;
                    } else if (weight >= 25 && linkDensity > 0.5) {
                        toRemove = true;
                    } else if ((embedCount === 1 && contentLength < 75) || embedCount > 1) {
                        toRemove = true;
                    }

                    if (toRemove) {
                        tagsList[i].parentNode.removeChild(tagsList[i]);
                    }
                }
            }
        }
    };

    /**
     * Clean a node of all elements of type "tag".
     * (Unless it's a youtube/vimeo video. People love movies.)
     *
     * @param Element
     * @param string tag to clean
     * @return void
     **/

    function clean(e, tag) {
        var targetList = e.getElementsByTagName(tag);
        var isEmbed = (tag == 'object' || tag == 'embed');

        for (var y = targetList.length - 1; y >= 0; y--) {
            /* Allow youtube and vimeo videos through as people usually want to see those. */
            if (isEmbed && targetList[y].innerHTML.search(regexps.videoRe) !== -1) {
                continue;
            }
            if (targetList[y] && targetList[y].parentNode) {
                var oParentNode = targetList[y].parentNode;
                oParentNode.removeChild(targetList[y]);
            }
        }
    };

    /**
     * Clean out spurious headers from an Element. Checks things like classnames and link density.
     *
     * @param Element
     * @return void
     **/

    function cleanHeaders(e) {
        for (var headerIndex = 1; headerIndex < 3; headerIndex += 1) {
            var headers = e.getElementsByTagName('h' + headerIndex);
            for (var i = headers.length - 1; i >= 0; i -= 1) {
                if (getClassWeight(headers[i]) < 0 || getLinkDensity(headers[i]) > 0.33) {
                    headers[i].parentNode.removeChild(headers[i]);
                }
            }
        }
    }

    /*获取node节点中字符串s出现的次数*/

    function getCharCount(e, s) {
        s = s || ",";
        return getInnerText(e).split(s).length - 1;
    }

    /*自定义选取模式*/

    function customChoose() {
        var modal = ' iread-dark-class';

        /*内容选取*/

        function addModal(e) {
            var el = e.target;
            var has = getElementsClassName(document, modal); //已经被添加了模态class的
            if (has && has.length > 0) {
                for (var i = has.length - 1; i >= 0; i--) {
                    has[i].className = has[i].className.replace(modal, ''); //去掉已经添加了class
                }
            }
            if (el && el.className && el.className.indexOf(modal) == -1) {
                el.className = el.className + modal;
            } else if (!el.className) {
                el.className = modal;
            }
        }

        /*进行页面转换*/

        function chooseElement(e) {
            var el = e.target;
            if (el.id === 'iread_custom_choose') {
                e.preventDefault(); //阻止默认
                e.stopPropagation(); //阻止冒泡
                return false;
            }
            /*custom read start*/

            //将onload 和 ununload事件清除掉
            window.onload = window.onunload = function() {};
            document.removeEventListener("mousemove", addModal);
            document.removeEventListener("mousedown", chooseElement);
            //todoyang:移除掉被添加上的蒙层
            $(".iread-dark-class").removeClass("iread-dark-class");

            document.getElementsByTagName('html')[0].id = 'inote_html';

            //移除所有的script标签
            removeScripts(document);

            //找到下一页的链接并且保存
            nextPageLink = null;

            //移除所有的style
            removeStyles(document);

            //将body缓存起来
            if (document.body && !bodyCache) {
                bodyCache = document.body.innerHTML;
            }

            //该页已经转换，添加到转换列表中
            parsedPages[window.location.href.replace(/\/$/, '')] = true;

            //构建新的DOM树
            var overlay = document.createElement("DIV");
            var innerDiv = document.createElement("DIV");
            var articleTools = getArticleTools();
            var articleTitle = getArticleTitle();
            var articleContent = el;
            var loading = getArticleLoading();
            var articleFooter = getArticleFooter();

            if (!articleContent) {
                showMessage("非常抱歉，你选择的页面无法完成转换，3秒钟后返回原网页。", 3);
                setTimeout(function() {
                    window.location.reload();
                }, 3000);
                return false;
            }

            overlay.id = "inote_overlay"; //蒙层
            innerDiv.id = "readInner";
            document.body.className = "contain article";
            overlay.className = "article_cont";
            innerDiv.className = "article_detail";
            innerDiv.appendChild(articleTitle); //标题
            innerDiv.appendChild(articleContent); //内容
            innerDiv.appendChild(loading); //加载loading图
            innerDiv.appendChild(articleFooter); //底部版权
            overlay.appendChild(articleTools);
            overlay.appendChild(innerDiv);

            document.body.innerHTML = "";
            document.body.insertBefore(overlay, document.body.firstChild);
            document.body.removeAttribute('style');
            window.scrollTo(0, 0);
            /*custom read end*/
            e.preventDefault(); //阻止默认
            e.stopPropagation(); //阻止冒泡
        }

        /*给document注册mousemove事件，实现蒙层效果*/
        document.addEventListener("mousemove", addModal);

        /*给document注册点击事件，点击时获取被选中元素的信息*/
        document.addEventListener("mousedown", chooseElement);
    };

    /*找到网页的base url，用来找到下一页的链接*/

    function findBaseUrl() {
        var noUrlParams = window.location.pathname.split("?")[0],
            urlSlashes = noUrlParams.split("/").reverse(),
            cleanedSegments = [],
            possibleType = "";


        for (var i = 0, slashLen = urlSlashes.length; i < slashLen; i += 1) {
            var segment = urlSlashes[i];

            // Split off and save anything that looks like a file type.
            if (segment.indexOf(".") !== -1) {
                possibleType = segment.split(".")[1];

                /* If the type isn't alpha-only, it's probably not actually a file extension. */
                if (!possibleType.match(/[^a-zA-Z]/)) {
                    segment = segment.split(".")[0];
                }
            }

            /**
             * EW-CMS specific segment replacement. Ugly.
             * Example: http://www.ew.com/ew/article/0,,20313460_20369436,00.html
             **/
            if (segment.indexOf(',00') !== -1) {
                segment = segment.replace(',00', '');
            }

            // If our first or second segment has anything looking like a page number, remove it.
            if (segment.match(/((_|-)?p[a-z]*|(_|-))[0-9]{1,2}$/i) && ((i === 1) || (i === 0))) {
                segment = segment.replace(/((_|-)?p[a-z]*|(_|-))[0-9]{1,2}$/i, "");
            }


            var del = false;

            /* If this is purely a number, and it's the first or second segment, it's probably a page number. Remove it. */
            if (i < 2 && segment.match(/^\d{1,2}$/)) {
                del = true;
            }

            /* If this is the first segment and it's just "index", remove it. */
            if (i === 0 && segment.toLowerCase() === "index") {
                del = true;
            }

            /* If our first or second segment is smaller than 3 characters, and the first segment was purely alphas, remove it. */
            if (i < 2 && segment.length < 3 && !urlSlashes[0].match(/[a-z]/i)) {
                del = true;
            }

            /* If it's not marked for deletion, push it to cleanedSegments. */
            if (!del) {
                cleanedSegments.push(segment);
            }
        }

        var baseUrl = window.location.protocol + "//" + window.location.host + cleanedSegments.reverse().join("/");
        // This is our final, cleaned, base article URL.
        dbg("baseUrl:" + baseUrl);
        return baseUrl;
    };

    var qidianNextPageUrl;
    var muluUrl; //连城书盟目录js地址
    var chapterArr; //连城书盟目录数组
    var firstGetNextPageLink = true;
    var PreChapterId; //上一章章节ID
    var theBookId; //连城书盟bookId
    var enterQidian = false;
    /*找到下一页的链接,返回一个url地址,传入是一个页面字符串*/

    function findNextPageLink(elem) {
        switch (thisSiteType) {
            case sites.qidian.host:
                sites.qidian.state = true;
                var qidianNextLink = document.getElementById("NextLink");
                if (qidianNextLink) {
                    dbg('起点中文网下一页：' + qidianNextLink.href);
                    $.get(qidianNextLink, {}, function(r) {
                        var oDiv = document.createElement("div");
                        oDiv.innerHTML = r;
                        var aSpan = oDiv.getElementsByTagName("span");
                        for (var i = 0, aSpanLen = aSpan.length; i < aSpanLen; i++) {
                            if (aSpan[i].id == "lbChapterName") {
                                nextChapterTitle = (aSpan[i].innerText);
                            }
                        }
                        var bookId = r.match(/nextpage\=.*aspx/).toString().split("/")[2].split(".")[0].split(",")[0];
                        var thisChapterId = r.match(/chapterId\:.*\'/).toString().split(":")[1].replace(/\'/gi, "").replace(/\ /gi, "");
                        PreChapterId = thisChapterId;
                        var nextChapterId = r.match(/nextpage\=.*aspx/).toString().split("/")[2].split(".")[0].split(",")[1];
                        var page = document.createElement("DIV");
                        page.innerHTML = r;
                        var content = getElementsClassName(page, "bookcontent")[0];
                        var script = content.getElementsByTagName("script")[0];
                        dbg('起点中文网下一页：' + script.src);
                        nextPageLink = script.src;
                        qidianNextPageUrl = "http://read.qidian.com/BookReader/" + bookId + "," + nextChapterId + ".aspx";
                    });
                } else {
                    $.get(qidianNextPageUrl, function(r) {
                        var oDiv = document.createElement("div");
                        oDiv.innerHTML = r;
                        var aSpan = oDiv.getElementsByTagName("span");
                        for (var i = 0, aSpanLen = aSpan.length; i < aSpanLen; i++) {
                            if (aSpan[i].id == "lbChapterName") {
                                nextChapterTitle = (aSpan[i].innerText);
                            }
                        }
                        var thisChapterId = r.match(/chapterId\:.*\'/).toString().split(":")[1].replace(/\'/gi, "").replace(/\ /gi, "");
                        //var qidianNextLink = "http://files.qidian.com/Author8/2317087/38904871.txt";
                        var bookId = r.match(/nextpage\=.*aspx/).toString().split("/")[2].split(".")[0].split(",")[0];
                        var nextChapterId = r.match(/nextpage\=.*aspx/).toString().split("/")[2].split(".")[0].split(",")[1];
                        prePageUrl = "http://read.qidian.com/BookReader/" + bookId + "," + PreChapterId + ".aspx";
                        qidianNextPageUrl = "http://read.qidian.com/BookReader/" + bookId + "," + nextChapterId + ".aspx";
                        /*对于不同的Author进行测试，找出正确的地址*/
                        PreChapterId = thisChapterId;

                        function getNextUrl(num) {
                            nextPageLink = "http://files.qidian.com/Author" + num + "/" + bookId + "/" + thisChapterId + ".txt";
                            $.getJSON(baseUrl + '/api/getstringfromurl?callback=?', {
                                url: encodeURIComponent(nextPageLink)
                            }, function(res) {
                                if (res.code == 0) {
                                    nextPageLink = "http://files.qidian.com/Author" + num + "/" + bookId + "/" + thisChapterId + ".txt";
                                    return;
                                } else {
                                    num++;
                                    getNextUrl(num);
                                }
                            })
                        }
                        getNextUrl(0);
                    })
                }
                break;
            case sites.readnovel.host:
                return $(elem).find("#next_page").attr("href");
            case sites.hongxiu.host:
                sites.hongxiu.state = true;
                return $(elem).find("#htmlxiazhang").attr("href");
            case sites.xxsy.host:
                return $(elem).find("#detailsubsbox span:eq(2) a").attr("href");
            case sites.xs8.host:
                return $(elem).find("#pager_next").attr("href");
            case sites.jjycw.host:
                var charperRegex = /[^&]*chapterid=(\d+)/gi;
                var matches = charperRegex.exec(curPageLink);
                if (matches && matches.length === 2) {
                    var nextCharperID = parseInt(matches[1]) + 1;
                    nextPageLink = curPageLink.replace(charperRegex, "chapterid=" + nextCharperID);
                    return nextPageLink;
                } else {
                    return '';
                }
            case sites.sinabook.host:
                return $(elem).find('#next_link').attr("href");
            case sites.hjsm.host:
                sites.hjsm.state = true;
                var articleBaseUrl;
                articleBaseUrl = nextPageLink ? nextPageLink : (findBaseUrl() + ".html");
                var thisChapterId = (articleBaseUrl.split("/")[4].match(/[0-9]+/g)[0])
                thisBookId = (articleBaseUrl.split("/")[3].match(/[0-9]+/g)[0])
                var nextChapterId;
                $.get(articleBaseUrl, function(r) {
                    var chapterUrlArrJsUrl = r.match(/http.*chapterUrlArr\.js/gi)[0];
                    var tempDiv = document.createElement("div");
                    tempDiv.id = "tempDiv"
                    tempDiv.style.display = "none"
                    document.body.appendChild(tempDiv)
                    $("#tempDiv").load(chapterUrlArrJsUrl, function(data) {
                        var chapterUrlArr = data.match(/http.*html/gi)[0].split(",")
                        var chapterIdArr = [];
                        var chapterUrlArrLen = chapterUrlArr.length
                        for (var i = 0; i < chapterUrlArrLen; i++) {
                            chapterIdArr.push(chapterUrlArr[i].split("/")[4].match(/[0-9]+/g)[0])
                            if ((chapterUrlArr[i].split("/")[4].match(/[0-9]+/g)[0]) == thisChapterId) {
                                nextChapterId = (chapterUrlArr[i + 1].split("/")[4].match(/[0-9]+/g)[0])
                                nextPageLink = "http://book.hjsm.tom.com/" + thisBookId + "/c" + nextChapterId + ".html"
                            }
                        }
                    })

                })
                break;
            case sites.mmzh.host:
                return $(elem).find(".key a:contains('下一章')").attr("href");
            case sites.zhulang.host:
                return $(elem).find(".readpage_leftnfy a:contains('下一章')").attr("href");
            case sites.seventeenK.host:
                return $(elem).find(".read_bottom .btn ul li:eq(3) a").attr("href");
            case sites.lcread.host:
                sites.lcread.state = true;
                articleBaseUrl = nextPageLink ? nextPageLink : findBaseUrl();
                var articleBaseUrlArr = articleBaseUrl.split("/");
                var theChapterId = parseInt(articleBaseUrlArr[articleBaseUrlArr.length - 1]);
                theBookId = parseInt(articleBaseUrlArr[articleBaseUrlArr.length - 2]);
                var thePageUrl = articleBaseUrl + ".html";
                if (firstGetNextPageLink) {
                    firstGetNextPageLink = false;
                    $.get(thePageUrl, function(r) {
                        muluUrl = r.match(/http.*mulu\.js/gi)[0];
                        $.get(muluUrl, function(e) {
                            chapterArr = e.match(/sum.*0\,/gi);
                            for (var i = 0, chapterArrLen = chapterArr.length; i < chapterArrLen; i++) {
                                if (theChapterId == chapterArr[i].split(",")[3]) {
                                    var theNextChapterId = chapterArr[i + 1].split(",")[3];
                                    nextPageLink = "http://www.lcread.com/bookPage/" + theBookId + "/" + theNextChapterId + ".js"
                                    var nextchapterurl = nextPageLink.replace(".js", "rc.html");
                                    $.get(nextchapterurl, function(r) {
                                        var tempDiv = document.createElement("div");
                                        tempDiv.innerHTML = r;
                                        nextChapterTitle = tempDiv.getElementsByTagName("h2")[0].innerText;
                                    })
                                    PreChapterId = theChapterId;
                                }
                            }
                        })
                    })
                } else {
                    for (var i = 0, chapterArrLen = chapterArr.length; i < chapterArrLen; i++) {
                        if (theChapterId == chapterArr[i].split(",")[3]) {
                            var theNextChapterId = chapterArr[i + 1].split(",")[3];
                            nextPageLink = "http://www.lcread.com/bookPage/" + theBookId + "/" + theNextChapterId + ".js"
                            var nextchapterurl = nextPageLink.replace(".js", "rc.html");
                            $.get(nextchapterurl, function(r) {
                                var tempDiv = document.createElement("div");
                                tempDiv.innerHTML = r;
                                nextChapterTitle = tempDiv.getElementsByTagName("h2")[0].innerText;
                            })
                            PreChapterId = theChapterId;
                        }
                    }
                }
                break;
            case sites.fmx.host:
                return $(elem).find('#nextChapterBtn').attr("href");
            case sites.threeGsc.host:
                return $(elem).find('#test a:contains("下一章")').attr('href');
            case sites.qqbook.host:
                sites.qqbook.state = true;
                var nowUrl = firstEnterState ? window.location.href : qidianNextPageUrl;
                var urlBid = nowUrl.split("#")[1].split("&")[0];
                var urlCid = nowUrl.split("#")[1].split("&")[1];
                qidianNextPageUrl = "http://book.qq.com/read.html?" + urlBid + "&g_f=&c_f=#" + urlBid + "&cid=" + (parseInt(urlCid.split("=")[1]) + 1) + "&c_f=&g_f=";
                return 'http://sight.qq.com/auth/read?uin=0&g_tk=5381&callback=_Callback&' + urlBid + '&cid=' + (parseInt(urlCid.split("=")[1]) + 1);
            case sites.rongshuxia.host:
                return $(elem).find('.ac_boot').find('img[alt="下一章"]').parent('a').attr("href");
            case sites.chuangshi.host:
                return $(elem).find('#nextChapterBtn').attr("href");
            case sites.qwsy.host:
                sites.qwsy.state = true;
                return $(elem).find(".readdown1 a:contains('下一章')").attr("href");
            case sites.qefeng.host:
                return $(elem).find("#content4").find("a:contains('下一章')").attr("href");
            case sites.tiexue.host:
                return $(elem).find(".readBth8 a:eq(2)").attr("href");
            case sites.motie.host:
                var nowUrl = firstGetNextPageLink ? window.location.href : nextPageLink;
                firstGetNextPageLink = false;
                dbg(nowUrl)
                $.getJSON(baseUrl + '/api/getstringfromurl?callback=?', {
                    url: encodeURIComponent(nowUrl)
                }, function(res) {
                    if (res.code == 0) {
                        var mtNextChapterId = res.content.match(/_CHAPTER.nextChapter\s+\=\s+\"[0-9]+\"/)[0].split('"')[1];
                        nextPageLink = nowUrl.match(/http.*\_/)[0] + mtNextChapterId;
                    }
                });
                break;
        }
        return; //todoyang:其他情况暂时屏蔽
    }

    /*获取一个链接的内容*/

    var curPageNum = 1;

    function appendNextPage() {
        if (curPageNum > maxPageNum) {
            showMessage("已经加载了" + curPageNum + "页，继续加载将可能导致浏览器卡顿。", 3);
            return false;
        }
        if (!nextPageLink) return false;
        beginLoading(); //显示loading图
        curPageNum += 1;
        var articlePage = document.createElement("DIV");
        articlePage.id = 'readability-page-' + curPageNum;
        articlePage.className = 'page';
        articlePage.innerHTML = '<p class="page-separator" title="Page ' + curPageNum + '">&sect; 第' + curPageNum + '章</p>';
        articlePage.className = 'article_detail';
        getNextChapterContent();
    };
    var tempNum = 0;

    function getNextChapterContent() {
        if (nextPageLink) {
            if (!sites.qidian.state && !sites.lcread.state) {
                prePageUrl = curPageLink
            };
            curPageLink = nextPageLink; //当前页链接变成下一页的链接
            if (sites.qqbook.state) {
                firstEnterState ? firstEnterState = false : addContentToPage();
                $.getJSON(baseUrl + '/api/getstringfromurl?callback=?', {
                    url: nextPageLink
                }, function(res) {
                    nextChapterTitle = res.content.match(/title.*\"\,/)[0].split(":")[1].replace(/\"|\,/g, "");
                    if (res.code == 0) {
                        var endContent = res.content.match(/<p.*(\/p>\")/)[0].replace(/\\r|\\/gi, "").replace(/uff01/gi, ",").replace(/uff0c/gi, ",");
                    }
                    nextChapter = {
                        chapters: [{
                            title: nextChapterTitle,
                            content: endContent
                        }]
                    }
                    deleteContentTag(nextChapterTitle, nextChapter.chapters[0].content);
                    dbg(exportNextChapter);
                    nextPageLink = findNextPageLink(); //找到新的下一页链接
                })
                endLoading();
            } else if (sites.qidian.state) {
                firstEnterState ? firstEnterState = false : addContentToPage();
                $.getJSON(baseUrl + '/api/getstringfromurl?callback=?', {
                    url: nextPageLink
                }, function(res) {
                    if (res.code == 0) {
                        nextChapter = {
                            chapters: [{
                                title: nextChapterTitle,
                                content: res.content.replace(/document\.write/, "").replace(/\(\'/g, "<p>")
                            }]
                        }
                        var tempDiv = document.createElement("div");
                        tempDiv.innerHTML += nextChapter.chapters[0].content;
                        clean(tempDiv, "a");
                        deleteContentTag(nextChapterTitle, tempDiv.innerHTML);
                        dbg(exportNextChapter);
                        findNextPageLink(); //找到新的下一页链接
                    }
                });
                endLoading();
            } else if (sites.lcread.state) {
                prePageUrl = "http://www.lcread.com/bookPage/" + theBookId + "/" + PreChapterId + "rc.html";

                function getContent() {
                    firstEnterState ? firstEnterState = false : addContentToPage();
                    var nextChapterContent = tempcontent.replace(/document\.write\(\'/, "    ");
                    nextChapter = {
                        chapters: [{
                            title: nextChapterTitle,
                            content: nextChapterContent
                        }]
                    }
                    deleteContentTag(nextChapterTitle, nextChapterContent);
                    dbg(exportNextChapter);
                    endLoading();
                    findNextPageLink(); //找到新的下一页链接
                }
                loadPage(nextPageLink, getContent); //解决ajax请求txt文件后编码集不一致导致读取乱码问题
            } else {
                $.get(nextPageLink, {}, function(r) {
                    if (sites.hjsm.state) { //幻剑书盟网站操作
                        var tempDiv = document.createElement("div");
                        tempDiv.innerHTML = r;
                        nextChapterTitle = tempDiv.getElementsByTagName("h3")[0].innerHTML;
                        findNextPageLink(r); //找到新的下一页链接
                        var hjsmTempJsUrl = nextPageLink.replace(/\.html/gi, ".js")
                        /*将http://book.hjsm.tom.com/126688/c907708.js转为http://book.hjsm.tom.com/12/126688/c907708.js*/
                        var tempSplitArr = hjsmTempJsUrl.split("/")
                        //hjsmTempJsUrl = tempSplitArr[0] + "//" + tempSplitArr[2] + "/12/" + tempSplitArr[3] + "/" + tempSplitArr[4]; //可能不是12

                            function csTempJsUrl(i) {
                                hjsmTempJsUrl = tempSplitArr[0] + "//" + tempSplitArr[2] + "/" + i + "/" + tempSplitArr[3] + "/" + tempSplitArr[4]; //可能不是12
                                $.getJSON(baseUrl + '/api/getstringfromurl?callback=?', {
                                    url: encodeURI(hjsmTempJsUrl)
                                }, function(res) {
                                    if (res.content.match(/CONTENT.*0\;/i)) {
                                        i++;
                                        csTempJsUrl(i);
                                    } else {
                                        tempNum = i;
                                        SelectNextContent(hjsmTempJsUrl); //幻剑书盟下一页内容提取
                                        return;
                                    }
                                })
                            }
                        csTempJsUrl(tempNum);
                    } else if (sites.qwsy.state) { //蔷薇书院网站操作
                        var temppage = document.createElement("div");
                        temppage.innerHTML = r;
                        nextChapterTitle = temppage.getElementsByTagName("h2")[0].innerHTML;
                        nextPageLink = findNextPageLink(temppage); //找到新的下一页链接
                        var qwsyNextJsUrl = r.match(/http.*js\'/)[0].replace(/\'/, ""); //在网页字符串中提取内容js地址

                        $.getJSON(baseUrl + '/api/getstringfromurl?callback=?', {
                            url: encodeURI(qwsyNextJsUrl)
                        }, function(res) {
                            var tempDiv = document.createElement("div");
                            tempDiv.id = "addCsDiv";
                            tempDiv.style.display = "none";
                            document.body.appendChild(tempDiv);
                            var chinaNextContent = res.content;
                            firstEnterState ? firstEnterState = false : addContentToPage();
                            var tempDiv = document.createElement("div");
                            tempDiv.innerHTML = chinaNextContent;
                            var aP = tempDiv.getElementsByTagName("p");
                            for (var i = 0, aPLen = aP.length; i < aPLen; i++) {
                                var oChildNode = aP[i].getElementsByTagName("font")[0];
                                if (oChildNode) {
                                    aP[i].removeChild(oChildNode);
                                }
                            }
                            nextChapter = getNextChapter(nextChapterTitle, tempDiv.innerHTML.replace(/\\n|\\|\"\)\;|document\.write\(\"/g, "").replace(/\<p\>/gi, "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"));
                            deleteContentTag(nextChapterTitle, tempDiv.innerHTML.replace(/\\n|\\|\"\)\;|document\.write\(\"/gi, ""));
                            /*去除蔷薇书院里面保护版权font标签*/
                            endLoading();
                        })
                    } else {
                        var temppage = document.createElement("div");
                        temppage.innerHTML = r;
                        nextPageLink = findNextPageLink(temppage); //找到新的下一页链接
                        var page = document.createElement("DIV");
                        var responseHtml = r.replace(/\n/g, '\uffff').replace(/<script.*?>.*?<\/script>/gi, '');
                        responseHtml = responseHtml.replace(/\n/g, '\uffff').replace(/<script.*?>.*?<\/script>/gi, '');
                        responseHtml = responseHtml.replace(/\uffff/g, '\n').replace(/<(\/?)noscript/gi, '<$1div');
                        responseHtml = responseHtml.replace(regexps.replaceBrs, '</p><p>');
                        page.innerHTML = responseHtml;
                        dbg(page)
                        flags = 0x1 | 0x2 | 0x4;
                        if (firstEnterState) {
                            firstEnterState = false;
                        } else {
                            /*对返回页面进行处理后将内容添加到页面中*/
                            if (!nextChapter.chapters[0].content) {
                                dbg("没有找到文档内容");
                                return;
                            }
                            dbg("下一页内容:" + nextChapter.chapters[0].content);
                            addContentToPage();
                        }

                        endLoading();
                        if (thisSiteType == sites.motie.host) {
                            var contentInner = getElementsClassName(page, "page-content")[0].children[0].innerHTML.replace(/\n+/g, "<p>").replace(/\s+/, "<p>      ");
                            var oP = document.createElement("p");
                            oP.innerHTML = contentInner;
                            oP.setAttribute("style", "font-size:15px");
                            var content = document.createElement("div");
                            content.appendChild(oP);
                        } else {
                            var content = grabArticle(page);
                        }
                        dbg(content);
                        switch (thisSiteType) {
                            case sites.readnovel.host:
                                nextChapterTitle = getElementsClassName(page, "newContentBody")[0].getElementsByTagName("h1")[0].innerHTML;
                                cleanTags(content, {
                                    tag1: "a",
                                    tag2: "b"
                                });
                                break;
                            case sites.hongxiu.host:
                                nextChapterTitle = (page.getElementsByTagName("h1")[0].innerHTML);
                                break;
                            case sites.xxsy.host:
                                nextChapterTitle = page.getElementsByTagName("h1")[0].children[0].innerHTML;
                                break;
                            case sites.xs8.host:
                                nextChapterTitle = page.getElementsByTagName("h2")[0].innerHTML;
                                clean(content, "a");
                                content.children[0].lastChild.parentNode.removeChild(content.children[0].lastChild)
                                break;
                            case sites.jjycw.host:
                                nextChapterTitle = temppage.getElementsByTagName("h2")[0].innerHTML;
                                cleanTags(content, {
                                    tag1: "img",
                                    tag2: "a",
                                    tag3: "input"
                                });
                                break;
                            case sites.sinabook.host:
                                nextChapterTitle = page.getElementsByTagName("h1")[0].innerHTML;
                                break;
                            case sites.mmzh.host:
                                nextChapterTitle = page.getElementsByTagName("h2")[1].innerHTML;
                                break;
                            case sites.zhulang.host:
                                nextChapterTitle = getElementsClassName(temppage, "readpage_leftntit")[0].innerHTML.split("，")[0];
                                break;
                            case sites.seventeenK.host:
                                nextChapterTitle = page.getElementsByTagName("h1")[0].innerHTML;
                                cleanTags(content.children[0], {
                                    tag1: "script",
                                    tag2: "div"
                                })
                                clean(content, "span");
                                if (content.children[0].getElementsByTagName("script")[0] && content.children[0].getElementsByTagName("script")[0].parentNode) {
                                    content.children[0].getElementsByTagName("script")[0].parentNode.removeChild(content.children[0].getElementsByTagName("script")[0]);
                                }
                                break;
                            case sites.fmx.host:
                                nextChapterTitle = getElementsClassName(page, "story_title")[0].innerHTML.replace(/\&nbsp\;/g, "  ");
                                cleanTags(content, {
                                    tag1: "span",
                                    tag2: "a"
                                });
                                if (content.children[0].getElementsByTagName("a")[0] && content.children[0].getElementsByTagName("a")[0].parentNode) {
                                    content.children[0].getElementsByTagName("a")[0].parentNode.removeChild(content.children[0].getElementsByTagName("a")[0]);
                                }
                                break;
                            case sites.threeGsc.host:
                                nextChapterTitle = getElementsClassName(temppage, "Article")[0].innerHTML;
                                break;
                            case sites.rongshuxia.host:
                                nextChapterTitle = getElementsClassName(page, "title")[0].getElementsByTagName("strong")[0].firstChild.nodeValue;
                                break;
                            case sites.qefeng.host:
                                var oRead_title = getElementsClassName(page, "read_title")[0];
                                if (oRead_title) nextChapterTitle = oRead_title.getElementsByTagName("h2")[0].innerHTML;
                                break;
                            case sites.tiexue.host:
                                var oContents = getElementsClassName(page, "d_content marTop")[0];
                                if (oContents) nextChapterTitle = oContents.getElementsByTagName("h1")[0].innerHTML.replace(/\n|\s+/g, "");
                                break;
                            case sites.motie.host:
                                nextChapterTitle = getElementsClassName(page, "title")[0].value;
                                clean(content, "img");
                                break;
                        }
                        var nextChapterContent = content.children[0].innerHTML;
                        nextChapter = getNextChapter(nextChapterTitle, nextChapterContent);
                        deleteContentTag(nextChapter.chapters[0].title, nextChapter.chapters[0].content);
                        dbg(exportNextChapter)
                    }
                });
            }
        }
    }

    /*清理某个元素里多余几种标签*/

    function cleanTags(oparent, object) {
        for (var i in object) {
            dbg(i);
            clean(oparent, object[i])
        }
    }
    /*将小说内容及标题添加到页面中*/

    function addContentToPage() {
        var oTempDiv = document.createElement("div");
        oTempDiv.innerHTML = "<h1>" + nextChapter.chapters[0].title + "</h1>";
        if (sites.lcread.state) {
            oTempDiv.innerHTML += "<p style='text-align: left'>" + nextChapter.chapters[0].content.replace(/\'\)\;/g, "").replace(/(\<br\>)+/gi, "<br>&nbsp&nbsp") + "</p>";
        } else {
            oTempDiv.innerHTML += nextChapter.chapters[0].content;
        }
        if (!isUsingFlashReader) document.getElementById("inote_main_content").appendChild(oTempDiv);
    }


    var prePageInfo;
    var prePageUrl;
    /*上一章对象函数*/

    function getPrePageInfo(booktitle, author, chapterTitle, chapterUrl, Domain) {
        prePageInfo = {
            "title": booktitle,
            "author": author,
            "chapterTitle": chapterTitle,
            "chapterUrl": chapterUrl,
            "Domain": Domain
        }
        return prePageInfo;
    }

    /**
     * 删除内容中标签
     * */

    function deleteContentTag(title, content) {
        if (sites.qefeng.host) content = content.replace(/&nbsp\;+/g, "  ");

        //对各网站标签进行处理
        if (sites.hongxiu.state) {
            var reg = /\<label\>|<\/label\>|\<\/div|>|\<font|\<\/font|\<\/em|\<span|\<\/span/gi;
            var nextChapterContent = content.replace(/\<\/p\>/gi, "\n").replace(/\<p\>|\<br\>|\<div\>|\<em\>/gi, "      ").replace(reg, "");
        } else if (sites.qidian.state || sites.xxsy.state || sites.jjycw.state || sites.readnovel.state || sites.zhulang.state || sites.seventeenK.state || sites.motie.host) {
            var reg = /\<p\>|\<\/div\>|C\&amp\;C|\<\!.*\>|\'\)\;|\<a\>.*\<\/a\>|\<br\>|\<div\>.*\<\/div\>|\<div\>|\<span\>.*\<\/span\>|\<hr.*\>|\<img.*\>/gi;
            var nextChapterContent = content.replace(/\<\/p\>/gi, "\n").replace(/\s+/, "       ").replace(reg, "");
        } else if (sites.xs8.state) {
            var nextChapterContent = content.replace(/\<br\>/gi, "\n").replace(/\<\/p\>|\<p\>/gi, "      ");
        } else if (sites.hjsm.state) {
            var nextChapterContent = content.replace(/\<\/p\>/gi, "\n      ");
        } else if (sites.lcread.state) {
            var nextChapterContent = content.replace(/&nbsp\;+|\'\)\;/gi, " ").replace(/(\<br\>)+/gi, "\n");
        } else {
            var reg = /\<br\>|\<div\>.*\<\/div\>|\<div\>|(&nbsp\;)+|\<\/div\>|\<h4\>|\<\/h4\>|<\!.*\>|\<pre.*\"\>|\<\/pre\>/gi;
            var nextChapterContent = content.replace(/\<\/p\>/gi, "\n").replace(/\<p\>/gi, "　　").replace(reg, "");
        }
        //更改当前章节的内容及标题
        if (exportNextChapter) {
            dbg(prePageInfo);
            webBook.chapters[0].title = exportNextChapter.chapters[0].title;
            webBook.chapters[0].content = exportNextChapter.chapters[0].content;
            $.getJSON(baseUrl + "/api/readhistory？callback=?", {
                "title": encodeURIComponent(prePageInfo.title),
                "author": encodeURIComponent(prePageInfo.author),
                "chapterTitle": encodeURIComponent(prePageInfo.chapterTitle),
                "chapterUrl": encodeURIComponent(prePageInfo.chapterUrl),
                "Domain": encodeURIComponent(prePageInfo.Domain)
            });
            prePageInfo = getPrePageInfo(webBook.bookTitle, webBook.bookAuthor, webBook.chapters[0].title, prePageUrl, webBook.site);
        }
        exportNextChapter = getNextChapter(title, nextChapterContent);
    }

    /**
     *解决ajax请求txt文件后编码集不一致导致读取乱码问题
     * */
    var tempcontent; //临时保存v的数据

    function loadPage(url, fun) {
        var xh = window.Event ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xh.open("GET", url, true);
        if (window.Event) xh.overrideMimeType("text/xml;charset=gb2312");
        xh.onreadystatechange = function() {
            if (xh.readyState != 4) return;
            var v;
            v = window.Event ? xh.responseText : window.gb2utf8(xh.responseBody);
            tempcontent = v;
            fun();
        }
        window.gb2utf8 = function(data) {
            var glbEncode = [],
                t, i, j, len;
            gb2utf8_data = data;
            execScript("gb2utf8_data = MidB(gb2utf8_data, 1)+' '", "vbscript");
            t = escape(gb2utf8_data).replace(/%u/g, "").replace(/(.{2})(.{2})/g, "%$2%$1").replace(/%([A-Z].)%(.{2})/g, "@$1$2");
            t = t.split("@");
            i = 0;
            len = t.length;
            while (++i < len) {
                j = t[i].substring(0, 4);
                if (!glbEncode[j]) {
                    gb2utf8_char = eval("0x" + j);
                    execScript("gb2utf8_char=Chr(gb2utf8_char)", "vbscript");
                    glbEncode[j] = escape(gb2utf8_char).substring(1, 6);
                }
                t[i] = glbEncode[j] + t[i].substring(4);
            }
            gb2utf8_data = gb2utf8_char = null;
            return unescape(t.join("%")).slice(0, -1);
        }
        xh.send(null);
    }

    /*网页下一页存在js文件中时里面内容的提取*/

    function SelectNextContent(url) {
        var tempDiv = document.createElement("div");
        tempDiv.id = "addCsDiv";
        tempDiv.style.display = "none"
        document.body.appendChild(tempDiv);
        /*请求js文件中的内容*/
        $("#addCsDiv").load(url, function(data) {
            var jsContent = data;
            var nextContent = jsContent.replace(/document\.write\(\"/gi, "");
            /* 转成中文*/

            function reconvert(str) {
                str = str.replace(/(\\u)(\w{4})/gi, function($0) {
                    return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{4})/g, "$2")), 16)));
                });
                str = str.replace(/(&#x)(\w{4});/gi, function($0) {
                    return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{4})(%3B)/g, "$2"), 16));
                });
                return str;
            }
            var chinaNextContent = reconvert(nextContent);
            firstEnterState ? firstEnterState = false : addContentToPage();
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = chinaNextContent.replace(/\<\/p\>/gi, "");
            var aP = tempDiv.getElementsByTagName("p");
            for (var i = 0, aPLen = aP.length; i < aPLen; i++) {
                var oChildNode = aP[i].getElementsByTagName("font")[0];
                if (oChildNode) aP[i].removeChild(oChildNode);
            }
            nextChapter = getNextChapter(nextChapterTitle, tempDiv.innerHTML.replace(/\\n|\\|\"\)\;/gi, "").replace(/\&lt\;\/p\&gt\;/gi, ""));
            deleteContentTag(nextChapterTitle, tempDiv.innerText.replace(/\\n|\\|\"\)\;/gi, ""));
            dbg(exportNextChapter);
            /*去除蔷薇书院里面保护版权font标签*/
            if (sites.qwsy.state) {
                var fontArr = document.getElementById("inote_main_content").getElementsByTagName("font");
                for (var i = 0; i <= (fontArr.length - 1);) {
                    fontArr[i].parentNode.removeChild(fontArr[i]);
                }
            }
            endLoading();
        })
    }



    /*显示loading章节*/

    function beginLoading() {
        isLoadingNextPage = true;
        if (!isUsingFlashReader) {
            var loading = document.getElementById('inote-loading');
            loading.style.display = 'block';
        }
    };

    /*隐藏loading图*/

    function endLoading() {
        if (!isUsingFlashReader) {
            var loading = document.getElementById('inote-loading');
            loading.style.display = 'none';
        }
        isLoadingNextPage = false;
    }


    /*移除flag*/

    function removeFlag(flag) {
        flags = flags & ~flag;
    };

    /*返回网站类型*/

    function getSiteType() {
        var baseUrl = window.location.href;
        for (var key in sites) {
            if (baseUrl.search(sites[key].host) !== -1) {
                return sites[key].host;
            }
        }
        return false;
    };

    function loadNextPage() {
        if (!isLoadingNextPage && ($(document).scrollTop() + $(window).height() > $(document).height() - 150)) {
            appendNextPage();
        }
    }

    function bindNextPageEvent() {
        if (!isUsingFlashReader) {
            if (sites.qwsy.state || sites.qqbook.state) {
                window.onscroll = function() {
                    loadNextPage();
                }
            } else {
                $(window).bind("scroll", loadNextPage); //绑定加载下一页的事件
            }
        }
    }

    /*特殊处理文档:去除广告，去除版权声明*/

    function specialDealwith(articleContent) {
        switch (thisSiteType) {
            case sites.jjycw.host:
            case sites.qwsy.host:
                var fonts = articleContent.getElementsByTagName("font");
                for (var i = fonts.length - 1; i >= 0; i--) {
                    fonts[i].parentNode.removeChild(fonts[i]);
                }
                break;
            case sites.mmzh.host:
                var spans = articleContent.getElementsByTagName("span");
                for (var i = spans.length - 1; i >= 0; i--) {
                    spans[i].parentNode.removeChild(spans[i]);
                }
                break;
            default:
                break;
        }
    }

    /**
     * Remove the header that doesn't have next sibling.
     *
     * @param Element
     * @return void
     **/

    function cleanSingleHeader(e) {
        for (var headerIndex = 1; headerIndex < 7; headerIndex++) {
            var headers = e.getElementsByTagName('h' + headerIndex);
            for (var i = headers.length - 1; i >= 0; --i) {
                if (headers[i].nextSibling === null) {
                    headers[i].parentNode.removeChild(headers[i]);
                }
            }
        }
    }

    /** 判断元素是否可见 */

    function elementVisible(element) {
        return element.offsetWidth > 0 || element.offsetHeight > 0 || element.width > 0 || element.height > 0;
    }

    /** 当提取内容为空时*/
    var temp_articleTitle;

    function contentNullReminder() {
        /*提示框*/
        var oDiv_mc = document.createElement("div");
        oDiv_mc.className = "help_explain_mc";
        oDiv_mc.id = "content_null_mc";
        var oDiv_close = document.createElement("div");
        oDiv_close.id = "oDiv_close";
        oDiv_close.innerHTML = "×";
        oDiv_mc.appendChild(oDiv_close);
        var oDivTemp = document.createElement("div");
        oDivTemp.className = "content_null";
        oDivTemp.id = "content_null";
        oDivTemp.setAttribute("style", "opacity:1;filter:alpha(opacity=100)")
        var oP = document.createElement("p");
        oP.setAttribute("style", "font-size:15px");
        oP.innerHTML = "无法提取有效内容，你可以直接保存该地址。<span style='margin-top: 20px;display: block'><input id='content_null_btn' type='button' value='确定'></span>";
        oP.className = "more_help1";
        document.body.appendChild(oDiv_mc);
        document.body.appendChild(oDivTemp);
        oDivTemp.appendChild(oP);
        $("#oDiv_close").click(function() {
            document.body.removeChild(oDiv_mc);
            document.body.removeChild(oDivTemp);
        })
        $("#content_null_btn").click(function() {
            var w = 540,
                h = 350;
            var left = (screen.width / 2) - (w / 2);
            var top = (screen.height / 2) - (h / 2);
            var popWindowAttrs = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left;
            window.open("http://www.ireadhome.com/article/savebookmark?url=" + encodeURIComponent(window.location.href) + "&title=" + encodeURIComponent(document.title), "_blank", popWindowAttrs);
        });
        return false;
    }
    /**内容为空时，添加成功时提示框的建立及去除*/

    function addSucessReminder_ContentNull() {
        var oP = document.createElement("p");
        oP.setAttribute("style", "font-size:15px");
        oP.innerHTML = "添加成功";
        oP.className = "more_help1";
        oP.setAttribute("style", "width:176px;margin:auto")
        document.getElementById("content_null").appendChild(oP);
        setTimeout(function() {
            document.getElementById("content_null").removeChild(oP);
            document.body.removeChild($(".help_explain_mc")[0]);
            document.body.removeChild($("#content_null")[0]);
        }, 2000)
    }
    /** 注册工具栏事件 */
    var inote_help_state = false;

    function bindToolbarConfigEvent() {
        /*手机二维码扫描*/
        var two_code = $("#inote_phone");
        two_code.hover(function() {
            $(this).children("div").show();
        }, function() {
            $(this).children("div").hide();
        })

        var setStyle = $(".set_style"),
            setUl = setStyle.children("ul");

        /**  保存配置文件 */

        function saveConfig(font, fontsize, theme) {
            if (platform === 0) {
                var config = {};
                config["font"] = font;
                config["fontsize"] = fontsize;
                config["theme"] = theme;
                dbg("设置style config" + font + "\t" + fontsize + " \t" + theme);
                chrome.storage.local.set({
                    "inote_config": config
                });
            }
        }

        setStyle.hover(function() {
            $(this).children("ul").stop().show();
        }, function() {
            /* 当收起设置窗口时保存配置 */
            $(this).children("ul").stop().hide();
            var articleCont = $(".article_cont");
            var font = articleCont.attr("data-font");
            var fontSize = parseInt(articleCont.attr("data-fontsize"));
            var theme = $('body').attr("data-theme");
            saveConfig(font, fontSize, theme);
        });

        /** 修改字体 */
        setUl.find(".set_font").find("li").click(function() {

            $(this).parent().find("i").removeClass('i_select');
            $(this).children("i").addClass("i_select");
            var newFont = $(this).attr("data-font");
            var fontsize = $(".article_cont").attr("data-fontsize");
            if (isUsingFlashReader) {
                switch (newFont) {
                    case "yahei":
                        document.getElementById("iRead4WebBook").changeFontName("微软雅黑");
                        break;
                    case "simsun":
                        document.getElementById("iRead4WebBook").changeFontName("宋体");
                        break;
                    case "kaiti":
                        document.getElementById("iRead4WebBook").changeFontName("楷体");
                        break;
                }
            } else {
                $(".article_cont").removeClass().addClass('article_cont ' + newFont + ' fontsize_' + fontsize).attr("data-font", newFont); //给articleCont重新设置字体class


            }

        });

        /** 修改主题 */
        /**
         * @param silvergray|dark|warmyellow|teagreen
         * */
        setUl.find(".set_theme").children("i").click(function() {
            setUl.find(".set_theme").children("i").attr({
                "style": "border:1px solid #cbcbcb"
            });
            $(this).attr({
                "style": "border:1px solid #FD6C0D"
            });
            var arr = $(this).attr("class").split("_");
            if (isUsingFlashReader) {
                switch (arr[1]) {
                    case "gray":
                        document.getElementById("iRead4WebBook").changeReadStyle("silvergray");
                        break;
                    case "black":
                        document.getElementById("iRead4WebBook").changeReadStyle("dark");
                        break;
                    case "yellow":
                        document.getElementById("iRead4WebBook").changeReadStyle("warmyellow");
                        break;
                    case "green":
                        document.getElementById("iRead4WebBook").changeReadStyle("teagreen");
                        break;
                }
            } else {
                $("body").removeClass().addClass("contain article_" + arr[1] + " b_" + arr[1]).attr("data-theme", arr[1]); //给body重新设置theme class
                $("#inote_main_title").removeClass().addClass(" h_" + arr[1]);
            }
        });

        /** 修改字号*/
        setUl.find(".set_size").children("i").click(function() {
            var fontLevel = parseInt($(".article_cont").attr("data-fontsize"));
            if (isUsingFlashReader) {
                if ($(this).hasClass("i_fontplus")) {
                    fontLevel = (fontLevel + 1) > 2 ? 2 : fontLevel + 1;
                } else {
                    fontLevel = (fontLevel - 1) < 0 ? 0 : fontLevel - 1;
                }
                switch (fontLevel) {
                    case 0:
                        var fontsize = 16;
                        document.getElementById("iRead4WebBook").changeFontSize(fontsize);
                        break;
                    case 1:
                        var fontsize = 18;
                        document.getElementById("iRead4WebBook").changeFontSize(fontsize);
                        break;
                    case 2:
                        var fontsize = 20;
                        document.getElementById("iRead4WebBook").changeFontSize(fontsize);
                        break;
                }
            } else {
                if ($(this).hasClass("i_fontplus")) {
                    fontLevel = (fontLevel + 1) > 3 ? 3 : fontLevel + 1;
                } else {
                    fontLevel = (fontLevel - 1) < 0 ? 0 : fontLevel - 1;
                }
                var font = $(".article_cont").attr("data-font");
                $(".article_cont").removeClass().addClass('article_cont fontsize_' + fontLevel + ' ' + font);
            }
            $(".article_cont").attr("data-fontsize", fontLevel);

        });

        /*使用说明*/

        $("#inote_help").click(function() {
            if (!inote_help_state) {
                helpExplain();
                inote_help_state = true;
            } else {
                helpExplainClose()
            }
            $("#help_explain_mc_close").click(function() {
                helpExplainClose();
            })
            $("#btn_help_close").click(function() {
                helpExplainClose();
            })
        })

        var flashMc;
        /*使用阅读器阅读*/
        $("#inote_reader").click(function() {
            if (window.innerHeight != undefined) {
                var mainHeight = parseInt(window.innerHeight) - 64 + "px";
            } else {
                var B = document.body,
                    D = document.documentElement;
                var mainHeight = parseInt(Math.min(D.clientHeight, B.clientHeight)) - 64 + "px";
            };
            if (window.innerWidth != undefined) {
                var mainWidth = parseInt(window.innerWidth) + "px";
            } else {
                var B = document.body,
                    D = document.documentElement;
                var mainWidth = parseInt(Math.min(D.clientWidth, B.clientWidth)) + "px";
            };
            flashMc = document.createElement("div");
            flashMc.id = "flashMc";
            flashMc.setAttribute("style", "width:" + mainWidth + ";height:" + mainHeight + ";background-color:#000;opacity:0.8;position:fixed;top:64px;left:0;z-index:100;filter:alpha(opacity=80)");
            var loadImg = document.createElement("img");
            loadImg.setAttribute("style", "position: absolute;top: 50%;left: 50%;margin-left: -90px;margin-top: -21px");
            loadImg.width = "42";
            loadImg.height = "42";
            loadImg.src = "http://file.ireadhome.com/static/inote/loading.gif";
            var loadH1 = document.createElement("h1");
            loadH1.setAttribute("style", "font-size: 25px;position: absolute;top: 50%;left: 50%;color: #fff;margin-left: -21px;margin-top: -22px;font-weight: 100");
            var oText = document.createTextNode("Flash加载中，请稍候......");
            loadH1.appendChild(oText);
            flashMc.appendChild(loadImg);
            flashMc.appendChild(loadH1);
            document.body.appendChild(flashMc);
            if (!isUsingFlashReader) {
                if (sites.qwsy.state) {
                    window.onscroll = function() {};
                } else {
                    $(window).unbind('scroll', loadNextPage); //解除滚动条事件
                }
                isUsingFlashReader = 1;
                var flashvars = {};
                var params = {};
                params.quality = "high";
                params.bgcolor = "#ffffff";
                params.allowscriptaccess = "always"; //不能修改
                params.allowfullscreen = "true"; //不能修改
                params.allowfullscreen = "true";
                params.wmode = "transparent";
                var attributes = {};
                attributes.id = "iRead4WebBook";
                attributes.name = "iRead4WebBook";
                attributes.align = "middle";
                swfobject.embedSWF(
                    "http://file.ireadhome.com/plugins/iRead4WebBook.swf", "inote_article_detail",
                    mainWidth, mainHeight,
                    "11.4.0", "",
                    flashvars, params, attributes);
                swfobject.createCSS("#inote_article_detail", "display:block;text-align:left;");
                $("#inote-footer").hide();
                /*使flash获得焦点*/
                if (document.getElementById("iRead4WebBook")) {
                    document.getElementById("iRead4WebBook").focus();
                    document.body.setAttribute("style", "overflow:hidden");
                }
            }
        });

        $("#inote_save").click(function() {
            var title = getInnerText(document.getElementById('inote_main_title'));
            var content = htmlEncode(document.getElementById('inote_main_content').innerHTML);
            var oMetaArr = document.getElementsByTagName("meta");
            for (var i = 0; i < oMetaArr.length; i++) {
                if (oMetaArr[i].content.match(/charset.*/)) {
                    var encodevar = oMetaArr[i].content.match(/charset.*/)[0].replace("charset=", "");
                }
            }
            post_to_url({
                'title': title,
                'content': content,
                'charset': "utf-8"
            })
        });

        var senImgUrlArr = [];
        var sendImgUrlContent = "";
        $("#inote_img_save").click(function() {
            document.body.style.backgroundColor = "#000";
            document.getElementById("inote_article_detail").style.display = "none";
            var imgDiv = document.createElement("div"); //图片展示主体div
            var btnDiv = document.createElement("div"); //提交div
            var closeDiv = document.createElement("div"); //顶部关闭div
            closeDiv.id = "inote_img_close";
            closeDiv.innerHTML = "关&nbsp&nbsp闭";
            closeDiv.setAttribute("style", "width:100%;height:40px;background-color:#fff;text-align:center;position:fixed;top:0;line-height:40px;font-size:25px;cursor:pointer;color:#000;z-index:255");
            document.getElementById('readInner').appendChild(closeDiv);

            btnDiv.setAttribute("style", "width:100px;height:30px;margin:auto;margin-bottom:20px;clear: both");
            btnDiv.innerHTML = "<input type='button' value='提&nbsp&nbsp交' style='border: none;width: 100px;height: 30px;background-color: #fff;cursor:pointer;'>"

            imgDiv.id = "inote_img_main";
            imgDiv.setAttribute("style", "width:95%;overflow:auto;position:absolute;top:0;left:2%;background-color:#000;z-index:240");
            var allImgUrlLen = allImgUrl.length;
            dbg(allImgUrl)
            for (var i = 0; i < allImgUrlLen; i++) {
                var oSpan = document.createElement("span");
                var oImg = document.createElement("img");
                oImg.setAttribute("style", "max-height:100%;max-width:100%");
                var oSelect = document.createElement("span");
                oSelect.setAttribute("style", "width:100%;height:40px;font-size:30px;position:absolute;left:0;line-height:40px;font-weight:900;" +
                    "background-color:#fff;display:none;bottom:0;z-index: 240;");
                oSelect.id = "inote_img-select" + i;
                oSelect.innerHTML = "√";
                oSpan.setAttribute("style", "width:200px;height:200px;line-height:200px;margin:10px;text-align:center;position:relative;cursor:pointer;" +
                    "display:block;float:left;border:1px solid #fff");
                oImg.src = allImgUrl[i];
                oSpan.appendChild(oImg);
                oSpan.appendChild(oSelect);
                imgDiv.appendChild(oSpan);
            }
            imgDiv.appendChild(btnDiv);
            document.getElementById('readInner').appendChild(imgDiv);

            /*点击选取喜欢图片并划勾函数*/
            var aSpan = document.getElementById("inote_img_main").children;
            for (var i = 0; i < aSpan.length - 1; i++) {
                aSpan[i].likestate = true;
                aSpan[i].onclick = function() {
                    if (this.likestate) {
                        this.likestate = false;
                        this.lastChild.style.display = "block";
                        senImgUrlArr.push(this.children[0].src);
                        dbg(senImgUrlArr)
                    } else {
                        this.likestate = true;
                        this.lastChild.style.display = "none";
                        var string = this.children[0].src;
                        senImgUrlArr = deletearr(senImgUrlArr, string);
                        dbg(senImgUrlArr)
                    }
                }
            }
            /*提交选取喜欢图片函数*/
            btnDiv.onclick = function() {
                sendImgUrlContent = "";
                for (var i = 0, sendIUAlen = senImgUrlArr.length; i < sendIUAlen - 1; i++) {
                    if (senImgUrlArr[i]) sendImgUrlContent += senImgUrlArr[i] + "|";
                }
                if (senImgUrlArr[sendIUAlen - 1]) sendImgUrlContent += senImgUrlArr[sendIUAlen - 1];
                //dbg(senImgUrlArr)
            }
            /*关闭图片展示区域*/
            $("#inote_img_close").click(function() {
                document.getElementById('readInner').removeChild(closeDiv);
                imgDiv.innerHTML = "";
                document.getElementById('readInner').removeChild(imgDiv);
                document.getElementById("inote_article_detail").style.display = "block";
                document.body.style.backgroundColor = "#fff";
            })

        })
    }
    /*从数组arr中删除已有数据string*/

    function deletearr(arr, string) {
        for (var k = 0, arrlen = arr.length; k < arrlen; k++) {
            if (arr[k] == string) {
                for (var j = k; j < arrlen; j++) {
                    arr[j] = arr[j + 1];
                }
                arr[arrlen - 1] = null;
                arr.pop();
            }
        }
        return arr;
    }

    function post_to_url(params) {
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("target", "_blank");
        form.setAttribute("accept-charset", "utf-8");
        form.setAttribute("action", baseUrl + "/article/new?token=" + usertoken);
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    /** html encode */

    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }
    /*end private methods*/

    /*start public methods*/
    var cacheDoc = document.createElement('div');
    cacheDoc.innerHTML = window.document.body.innerHTML;
    iNote.articleContent = grabArticle(cacheDoc);
    iNote.articleTitle = getArticleTitle();

    /** 获取文章内容 */
    iNote.getContent = function(page, debug) {
        debug("进入抓取内容");
        dbg = debug;
        var articleContent = grabArticle(page);
        return articleContent;
    };
    /** 获取文章标题 */
    iNote.getTitle = function(title, debug) {
        debug('进入获取标题');
        dbg = debug;
        return getArticleTitle(title);
    };

    iNote.init = function() {
        if (platform === 0) {
            chrome.storage.local.get('inote_config', function(res) {
                var inoteConfig = res["inote_config"];
                dbg(inoteConfig);
                var font = inoteConfig["font"];
                var fontSize = inoteConfig["fontsize"];
                var theme = inoteConfig["theme"];
                styleConfig = {
                    font: font,
                    fontsize: fontSize,
                    theme: theme
                };
                dbg("google chrome style config加载完毕: font=" + font + " font-size=" + fontSize + " theme=" + theme);
            });
        }
    };
    var webBookInterval = setInterval(function() {
        if (webBook) {
            iNote.webBook = webBook;
            clearInterval(webBookInterval);
        }
    }, 500)

    iNote.getWebBook = function() {
        return webBook;
    };

    //发送下一个章节的数据给flash插件
    iNote.sendNextChapter = function() {
        var reader = swfobject.getObjectById("iRead4WebBook");
        if (reader) {
            if (exportNextChapter) {
                reader.sendNextChapter(JSON.stringify(exportNextChapter), 'success');
                exportNextChapter = null;
                //触发加载下一页
                if (!isLoadingNextPage) {
                    appendNextPage();
                }
            }
        } else {
            alert('无法获取到阅读器对象');
        }
    };

    /*end public methods*/
}(window.iNote = window.iNote || {}, jQuery));

iNote.init();
//iNote.read();
var sendContent = iNote.articleContent.innerHTML.replace(/\s{4,}/ig,'');
var sendtitle = iNote.articleTitle.innerText;
chrome.extension.sendRequest({
    greeting: "hello",
    content: sendContent,
    title: sendtitle
}, function(response) {

});
/*
 * method : stringify(obj);
 * return : json string
 * source : https://gist.github.com/754454
 */
var stringify = function(obj) {
    //如果是IE8+ 浏览器(ff,chrome,safari都支持JSON对象)，使用JSON.stringify()来序列化
    if (window.JSON) {
        return JSON.stringify(obj);
    }
    var t = typeof(obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    } else {
        // recurse array or object
        var n, v, json = [],
            arr = (obj && obj.constructor == Array);
        // fix.
        var self = arguments.callee;
        for (n in obj) {
            v = obj[n];
            t = typeof(v);
            if (obj.hasOwnProperty(n)) {
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null)
                // v = jQuery.stringify(v);
                    v = self(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};
/** 获取书籍信息 */

function getBookInfo() {
    var Otemp = document.getElementById("flashMc");
    if (Otemp) {
        document.body.removeChild(Otemp);
    }
    return JSON.stringify(iNote.webBook);
}

/** 监听插件请求 */

function requestNextChapter() {
    iNote.sendNextChapter();
}
