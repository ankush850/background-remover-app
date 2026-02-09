document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const uploadPrompt = document.getElementById('upload-prompt');
    const processingView = document.getElementById('processing-view');
    const resultCard = document.getElementById('result-card');
    const originalPreview = document.getElementById('original-preview');
    const resultImage = document.getElementById('result-image');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const progressBar = document.getElementById('progress-bar');

    // Trigger file input on click
    browseBtn.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('click', (e) => {
        if (e.target !== browseBtn && !processingView.classList.contains('hidden')) return;
        if (e.target === browseBtn) return;
        fileInput.click();
    });

    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
    });

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                uploadImage(file);
            } else {
                alert('Please upload an image file.');
            }
        }
    }

    function uploadImage(file) {
        // Show processing state
        uploadPrompt.classList.add('hidden');
        processingView.classList.remove('hidden');
        dropZone.style.padding = '4rem 2rem';
        
        // Show original preview
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Prepare data
        const formData = new FormData();
        formData.append('image', file);

        // Progress bar simulation (since we don't have real-time progress from rembg easily)
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 90) progress = 90;
            progressBar.style.width = `${progress}%`;
        }, 300);

        // Send to server
        fetch('/remove-background', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            clearInterval(interval);
            progressBar.style.width = '100%';
            
            if (data.success) {
                setTimeout(() => {
                    displayResult(data.image_url);
                }, 500);
            } else {
                alert('Error: ' + (data.error || 'Failed to process image'));
                resetUI();
            }
        })
        .catch(error => {
            clearInterval(interval);
            console.error('Error:', error);
            alert('An error occurred during processing.');
            resetUI();
        });
    }

    function displayResult(imageUrl) {
        resultImage.src = imageUrl;
        downloadBtn.href = imageUrl;
        
        dropZone.classList.add('hidden');
        resultCard.classList.remove('hidden');
    }

    function resetUI() {
        uploadPrompt.classList.remove('hidden');
        processingView.classList.add('hidden');
        dropZone.classList.remove('hidden');
        resultCard.classList.add('hidden');
        fileInput.value = '';
        progressBar.style.width = '0%';
    }

    resetBtn.addEventListener('click', resetUI);
});
