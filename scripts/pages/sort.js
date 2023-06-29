let tab=[5,44,2,3,18,1,9]

function compare(a, b) {
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    return 0;
}

let tabTrie = tab.sort(compare)
console.log(tabTrie)