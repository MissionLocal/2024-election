document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Pym.js child
    var pymChild = new pym.Child();

    const images = document.querySelectorAll('.portrait-row .portrait-container img');
    const popup = document.querySelector('.popup');
    const container = document.querySelectorAll('.portrait-container');
    const overlay = document.querySelector('.overlay');
    const popupImg = document.getElementById('popup-img');
    const popupDescription = document.getElementById('popup-description');
    const closeBtn = document.getElementById('close-btn');

    images.forEach(image => {
        image.addEventListener('click', () => {
        const popupImgSrc = image.getAttribute('data-popup-image');
        const description = image.getAttribute('data-description');

        popupImg.src = popupImgSrc;
        popupDescription.innerHTML = description;

        popup.style.display = 'block';
        overlay.style.display = 'block';
        });

        // Notify Pym.js to adjust iframe height
        pymChild.sendHeight();
    
    });

    container.forEach(container => {
        container.addEventListener('click', () => {
            // triggers only on mobile
            if (window.matchMedia('(max-width: 600px)').matches) {

                // Check the class of the container clicked
                if (container.classList.contains('top')) {
                    popup.style.top = '80vh';
                } else if (container.classList.contains('middle')) {
                    popup.style.top = '50vh';
                } else if (container.classList.contains('bottom')) {
                    popup.style.top = '20vh';
                }
                else {
                    popup.style.top = '50vh';
                }
            }
        }
    )}
    );

    const closePopup = () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    };

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);

    // Resize the iframe once charts are drawn
    pymChild.sendHeight();
    
});