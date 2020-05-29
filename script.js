// ==UserScript==
// @name         Search By HotKey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Put the focus in the search bar
// @author       Ray
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://v2ex.com/*
// @match        https://juejin.im/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // if you use firefox, you must disable fast search first.
    // about:config -> accessibility.typeaheadfind.manual -> false
    let hotkey = "/";

    let controllerMap = {
        /*
        host: {
            pathname: {        // RegExp
                tagName: "",   // must have
                className: "", // optional
                id: "",        // optional
            }
        }
        */
        "www.bilibili.com": {
            // homepage
            "^\/$": {
                "tagName": "input",
                "className": "nav-search-keyword",
            },
            // category page
            "^\/v\/[\\w]+\/$": {
                "tagName": "input",
                "className": "nav-search-keyword",
            },
            // video page
            "^\/video\/.+": {
                "tagName": "input",
                "className": "nav-search-keyword",
            },
        },

        "space.bilibili.com": {
            // space page
            "^\/[\\d]+$": {
                "tagName": "input",
                "className": "nav-search-keyword",
            },
        },

        "v2ex.com": {
            // homepage
            "^\/$": {
                "tagName": "input",
                "id": "q",
            },
            // article page
            "^\/t\/.+": {
                "tagName": "input",
                "id": "q",
            },
        },

        "juejin.im": {
            // homepage
            "^\/timeline$": {
                "tagName": "input",
                "className": "search-input",
            },
            // post page
            "^\/post\/.+": {
                "tagName": "input",
                "className": "search-input",
            },
        },
    };

    let findSearchBar = function(condition) {
        var candidates = Array.from(document.getElementsByTagName(condition.tagName));

        if (condition.hasOwnProperty("id")) {
            candidates = candidates.filter(cond => cond.id === condition.id);
        }

        if (condition.hasOwnProperty("className")) {
            candidates = candidates.filter(cond => cond.className === condition.className);
        }

        return candidates.length === 1 ? candidates[0] : null;
    };

    document.addEventListener('keyup', (event) => {
        if (event.target.tagName != "BODY") {
            return;
        }

        if (event.key === hotkey) {
            let host = window.location.host;
            if (controllerMap.hasOwnProperty(host)) {
                let pathname = window.location.pathname;
                let pathnames = Object.keys(controllerMap[host]);
                for (let i = 0; i < pathnames.length; i++) {
                    let p = pathnames[i];
                    let re = new RegExp(p);
                    if (re.test(pathname)) {
                        let searchBar = findSearchBar(controllerMap[host][p]);
                        if (searchBar != null) {
                            searchBar.focus();
                            return;
                        }
                    }
                }
            }
        }
    }, false);
})();