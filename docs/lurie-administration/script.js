document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Pym.js child
    var pymChild = new pym.Child();
    
    // Resize the iframe once charts are drawn
    pymChild.sendHeight();

    // Add smooth scrolling for in-page navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Calculate precise scroll position
                const yOffset = -10; // Adjust this value if there's a sticky header or offset needed
                const yPosition = targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: yPosition, behavior: 'smooth' });

                // Send height update to parent after scrolling
                setTimeout(() => {
                    pymChild.sendHeight();
                }, 500); // Adjust delay if needed to match scrolling duration
            }
        });
    });
});
