document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Pym.js child
    var pymChild = new pym.Child();
    
    // Resize the iframe once charts are drawn
    pymChild.sendHeight();

});