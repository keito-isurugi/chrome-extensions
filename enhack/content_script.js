if (localStorage.getItem('enhack_parser_nologin') !== null) {
    localStorage.removeItem('enhack_parser_nologin');
    console.log('enhack_parser_nologin key was removed.');
} else {
    console.log('enhack_parser_nologin key does not exist.');
}
