document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll('.tiktok-video');
    const feed = document.getElementById('video-feed');

    // 1. Play/Pause on Click
    videos.forEach(video => {
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });

    // 2. Intersection Observer to play only the visible video
    const observerOptions = {
        root: feed,
        rootMargin: '0px',
        threshold: 0.7 // 70% of video must be visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(e => console.log("Auto-play prevented by browser"));
            } else {
                video.pause();
                video.currentTime = 0; // Reset video
            }
        });
    }, observerOptions);

    videos.forEach(video => {
        observer.observe(video);
    });

    // 3. Double Tap to Like and Animation
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach(container => {
        let lastTap = 0;
        const video = container.querySelector('.tiktok-video');
        const heartBtn = container.querySelector('.action-btn .heart-icon');

        video.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected
                e.preventDefault();
                
                // Toggle like button
                if (!heartBtn.classList.contains('liked')) {
                    heartBtn.classList.add('liked');
                    // Change to solid heart
                    heartBtn.classList.remove('far');
                    heartBtn.classList.add('fas');
                }

                // Create floating heart animation
                createFloatingHeart(e, container);
                
            } else {
                // Single tap handled by play/pause listener
            }
            lastTap = currentTime;
        });

        // Like Button click logic
        const likeBtnContainer = container.querySelector('.action-btn:nth-child(2)');
        if (likeBtnContainer) {
            likeBtnContainer.addEventListener('click', () => {
                heartBtn.classList.toggle('liked');
                if (heartBtn.classList.contains('liked')) {
                    heartBtn.classList.remove('far');
                    heartBtn.classList.add('fas');
                } else {
                    heartBtn.classList.add('fas');
                    heartBtn.classList.remove('liked');
                }
            });
        }
    });

    function createFloatingHeart(e, container) {
        const heart = document.createElement('i');
        heart.classList.add('fas', 'fa-heart', 'floating-heart');
        
        // Calculate position relative to container
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        container.appendChild(heart);

        // Remove element after animation
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
});
