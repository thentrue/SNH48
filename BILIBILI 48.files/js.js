var c_lTabs=7;
var c_rgszSh=new Array(c_lTabs);
c_rgszSh[0]="总表";
c_rgszSh[1]="SNH48";
c_rgszSh[2]="GNZ48";
c_rgszSh[3]="BEJ48";
c_rgszSh[4]="SHY48";
c_rgszSh[5]="CKG48";
c_rgszSh[6]="其他";
var g_iShCur=2;
var g_rglTabX=new Array(c_lTabs+1);
var g_clrs=new Array(8);
g_clrs[0]="window";
g_clrs[1]="buttonface";
g_clrs[2]="windowframe";
g_clrs[3]="windowtext";
g_clrs[4]="threedlightshadow";
g_clrs[5]="threedhighlight";
g_clrs[6]="threeddarkshadow";
g_clrs[7]="threedshadow";

function fnGetIEVer() 
{
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE");
	if (msie > 0 && window.navigator.platform == "Win32")
		return parseInt(ua.substring(msie+5, ua.indexOf(".",msie)));
	else
		return 0;
}
function fnMouseOverTab(event, iTab)
{
	if (iTab != g_iShCur){
		if (parent.window.g_iIEVer>=4){
			frames['frTabs'].event.srcElement.style.background=g_clrs[5];
		}
		else{
			event.target.style.background=g_clrs[5];		}
	}
}
function fnMouseOutTab(event, iTab)
{
	if (iTab >= 0 && iTab != g_iShCur){
		if (parent.window.g_iIEVer >= 4)
			frames['frTabs'].event.srcElement.style.background=g_clrs[1];
		else
			target=event.target.style.background=g_clrs[1];
	}
}
function fnSetTabProps(iTab, fActive)
{
	if (iTab>=0){
		with (frames['frTabs'].document.all.aTab[iTab].style){
			background = fActive ? "#B0E0E6" : g_clrs[1];
			cursor = (fActive ? "default" : "pointer");
		}
	}
}
function fnSetActiveSheet(iSh)
{
	if (iSh != g_iShCur){
		fnSetTabProps(g_iShCur, false);
		fnSetTabProps(iSh, true);
		g_iShCur = iSh;
	}
}
function fnInit()
{
	g_rglTabX[0] = 0;
	var row = frames['frTabs'].document.all.tbTabs.rows[0];
	for (var i = 1; i <= c_lTabs; ++i)
		g_rglTabX[i] = row.cells[i-1].offsetLeft + row.cells[i-1].offsetWidth;
	fnSetTabProps(g_iShCur, true);
}
function fnUpdateTabs(index)
{
	if (index < 0)
		return;
	if (document.readyState == "complete")
		fnSetActiveSheet(index);
	else
		window.setTimeout("fnUpdateTabs("+index+");",150);
}
function fnBuildFrameset(index)
{
	var szHTML = "<frameset rows=\"*,18px\" border=0 width=0 frameborder=no framespacing=0>" + "<frame src=\""+document.all.item("shLink")[index].href+"\" name=\"frSheet\" noresize>" + "<frameset cols=\"80px,*\" border=0 width=0 frameborder=no framespacing=0>"+"<frame name=\"frScroll\" marginwidth=0 marginheight=0 scrolling=no noresize>"+"<frame name=\"frTabs\" marginwidth=0 marginheight=0 scrolling=no noresize>"+"</frameset></frameset>";
	with (document){
		open('text/html', 'replace');
		write(szHTML);
		close();
	}
	fnBuildTabStrip();
}
function fnNextTab(fDir)
{
	var iNextTab = -1;
	var i;
	with (frames['frTabs'].document.body){
		if (fDir == 0){
			if (scrollLeft > 0){
				for (i = 0; i < c_lTabs && g_rglTabX[i] < scrollLeft; ++i);
				if ( i < c_lTabs)
					iNextTab = i - 1;
			}
		}
		else{
			if (g_rglTabX[c_lTabs] > offsetWidth + scrollLeft){
				for (i = 0; i < c_lTabs && g_rglTabX[i] <= scrollLeft; ++i);
				if (i < c_lTabs)
					iNextTab=i;
			}
		}
	}
	return iNextTab;
}
function fnScrollTabs(fDir)
{
	var iNextTab = fnNextTab(fDir);
	if (iNextTab >= 0){
		frames['frTabs'].scroll(g_rglTabX[iNextTab], 0);
		return true;
	}
	else
		return false;
}
function fnFastScrollTabs(fDir)
{
	if (c_lTabs > 16)
		frames['frTabs'].scroll(g_rglTabX[fDir ? c_lTabs-1 : 0], 0);
	else if (fnScrollTabs(fDir) > 0)
		window.setTimeout("fnFastScrollTabs("+fDir+");", 5);
}
function fnMouseOverScroll(iCtl)
{
	frames['frScroll'].document.all.tdScroll[iCtl].style.color = g_clrs[7];
}
function fnMouseOutScroll(iCtl)
{
	frames['frScroll'].document.all.tdScroll[iCtl].style.color = g_clrs[6];
}
function fnBuildTabStrip()
{
	var szHTML = "<html><head><style>.clScroll{font:8pt Courier New;cursor:default;line-height:10pt;}"+".clScroll2{font:10pt Arial;cursor:default;line-height:11pt;}</style></head>"+"<body topmargin=0 leftmargin=0><table border=1 cellpadding=0 cellspacing=0 width=100%>"+"<tr>"+"<td valign=top id=tdScroll class=\"clScroll\" onclick=\"parent.fnFastScrollTabs(0);\" ondblclick=\"parent.fnFastScrollTabs(0);\" onmouseover=\"parent.fnMouseOverScroll(0);\" onmouseout=\"parent.fnMouseOutScroll(0);\">&nbsp;&#171;&nbsp;</td>"+"<td valign=top id=tdScroll class=\"clScroll2\" onclick=\"parent.fnScrollTabs(0);\" ondblclick=\"parent.fnScrollTabs(0);\" onmouseover=\"parent.fnMouseOverScroll(1);\" onmouseout=\"parent.fnMouseOutScroll(1);\">&nbsp;&lt;&nbsp;</td>"+"<td valign=top id=tdScroll class=\"clScroll2\" onclick=\"parent.fnScrollTabs(1);\" ondblclick=\"parent.fnScrollTabs(1);\" onmouseover=\"parent.fnMouseOverScroll(2);\" onmouseout=\"parent.fnMouseOutScroll(2);\">&nbsp;&gt;&nbsp;</td>"+"<td valign=top id=tdScroll class=\"clScroll\" onclick=\"parent.fnFastScrollTabs(1);\" ondblclick=\"parent.fnFastScrollTabs(1);\" onmouseover=\"parent.fnMouseOverScroll(3);\" onmouseout=\"parent.fnMouseOutScroll(3);\">&nbsp;&#187;&nbsp;</td>"+"</tr></table></body></html>";
	with (frames['frScroll'].document){
		open("text/html","replace");
		write(szHTML);
		close();
	}
	szHTML = "<html><head>"+"<style>A:link,A:visited,A:active{text-decoration:none;"+"color:#000000;}"+".clTab{cursor:hand;background:"+g_clrs[1]+";font:9pt \"宋体\";padding-left:3px;padding-right:3px;text-align:center;}"+"</style></head><body onload=\"parent.fnInit();\" topmargin=0 leftmargin=0><table id=tbTabs border=1 cellpadding=0 cellspacing=0><tr>"; 
	for (i = 0; i < c_lTabs; ++i){
		szHTML+="<td id=tdTab height=1 nowrap class=\"clTab\" "+"onmouseover=\"parent.fnMouseOverTab(event," + i + ");\" onmouseout=\"parent.fnMouseOutTab(event,"+i+");\">"+"<a href=\""+document.all.item("shLink")[i].href+"\" target=\"frSheet\" id=aTab>&nbsp;"+c_rgszSh[i]+"&nbsp;</a></td>"; 
	}
	szHTML += "</tr></table></body></html>";
	with (frames['frTabs'].document){
		open('text/html','replace');
		write(szHTML);
		close();
	}
}
