document.addEventListener('DOMContentLoaded', function() {
  // Lấy tất cả các tooltip point có nhiều section
  const tooltipPoints = document.querySelectorAll('.tooltip-point');
  
  tooltipPoints.forEach(point => {
    const sections = point.querySelectorAll('.tooltip-section');
    if (sections.length <= 1) return; // Bỏ qua nếu chỉ có 1 section
    
    let currentSectionIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Add drag handles to sections
    sections.forEach(section => {
      const dragHandle = document.createElement('div');
      dragHandle.className = 'drag-handle';
      section.appendChild(dragHandle);
      
      // Make section draggable
      section.setAttribute('draggable', 'true');
      
      section.addEventListener('dragstart', (e) => {
        section.classList.add('dragging');
        e.dataTransfer.setData('text/plain', Array.from(sections).indexOf(section));
      });
      
      section.addEventListener('dragend', () => {
        section.classList.remove('dragging');
      });
      
      section.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingSection = document.querySelector('.dragging');
        if (draggingSection === section) return;
        
        const rect = section.getBoundingClientRect();
        const y = e.clientY - rect.top;
        
        if (y < rect.height / 2) {
          section.parentNode.insertBefore(draggingSection, section);
        } else {
          section.parentNode.insertBefore(draggingSection, section.nextSibling);
        }
      });
    });
    
    // Add touch swipe functionality
    point.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    
    point.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance for swipe
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          // Swipe right - go to previous section
          currentSectionIndex = (currentSectionIndex - 1 + sections.length) % sections.length;
        } else {
          // Swipe left - go to next section
          currentSectionIndex = (currentSectionIndex + 1) % sections.length;
        }
        updateActiveSection();
      }
    }
    
    // Add navigation buttons
    const navDiv = document.createElement('div');
    navDiv.className = 'section-nav';
    
    const prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.addEventListener('click', () => {
      currentSectionIndex = (currentSectionIndex - 1 + sections.length) % sections.length;
      updateActiveSection();
    });
    
    const nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.addEventListener('click', () => {
      currentSectionIndex = (currentSectionIndex + 1) % sections.length;
      updateActiveSection();
    });
    
    navDiv.appendChild(prevButton);
    navDiv.appendChild(nextButton);
    point.querySelector('.tooltip-content').appendChild(navDiv);
    
    // Xử lý sự kiện lăn chuột
    point.addEventListener('wheel', function(e) {
      e.preventDefault(); // Ngăn chặn scroll mặc định
      
      // Xác định hướng lăn chuột
      if (e.deltaY > 0) {
        // Lăn xuống - chuyển đến section tiếp theo
        currentSectionIndex = (currentSectionIndex + 1) % sections.length;
      } else {
        // Lăn lên - chuyển đến section trước đó
        currentSectionIndex = (currentSectionIndex - 1 + sections.length) % sections.length;
      }
      
      updateActiveSection();
    });
    
    function updateActiveSection() {
      // Ẩn tất cả các section
      sections.forEach(section => section.classList.remove('active'));
      
      // Hiển thị section hiện tại
      sections[currentSectionIndex].classList.add('active');
      
      // Update button states
      prevButton.disabled = sections.length <= 1;
      nextButton.disabled = sections.length <= 1;
    }
    
    // Initialize first section
    updateActiveSection();
  });
}); 