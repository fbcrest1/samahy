// Các biến toàn cục để quản lý trạng thái modal
let zoomLevel = 1;
let isPanning = false;
let startX, startY;
let translateX = 0, translateY = 0;
let initialTranslateX = 0, initialTranslateY = 0;

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");

// ---- CÁC HÀM XỬ LÝ SỰ KIỆN KÉO ẢNH ----

// Khi bắt đầu nhấn chuột xuống ảnh
function onMouseDown(e) {
  // Chỉ cho phép kéo khi ảnh đã được phóng to
  if (zoomLevel <= 1) {
    return;
  }
  
  e.preventDefault(); // Ngăn hành vi mặc định của trình duyệt (như kéo thả ảnh)
  isPanning = true;
  startX = e.pageX;
  startY = e.pageY;
  
  // Lưu lại vị trí translate hiện tại trước khi kéo
  initialTranslateX = translateX;
  initialTranslateY = translateY;
  
  modalImage.style.cursor = 'grabbing'; // Đổi con trỏ chuột
  modalImage.style.transition = 'none'; // Tắt transition để kéo mượt hơn
}

// Khi di chuyển chuột
function onMouseMove(e) {
  if (!isPanning) {
    return;
  }
  
  e.preventDefault();
  
  const deltaX = e.pageX - startX;
  const deltaY = e.pageY - startY;
  
  // Vị trí mới = Vị trí ban đầu + Quãng đường di chuyển
  // Phải chia cho zoomLevel để ảnh di chuyển đúng với khoảng cách tay kéo
  translateX = initialTranslateX + (deltaX / zoomLevel);
  translateY = initialTranslateY + (deltaY / zoomLevel);
  
  updateImageTransform();
}

// Khi nhả chuột ra
function onMouseUp(e) {
  if (!isPanning) {
    return;
  }
  
  isPanning = false;
  modalImage.style.cursor = 'grab'; // Trả lại con trỏ chuột
  modalImage.style.transition = 'transform 0.3s ease'; // Bật lại transition
}

// ---- CÁC HÀM CỦA MODAL ----

// Hàm cập nhật transform cho ảnh (gom cả scale và translate)
function updateImageTransform() {
    modalImage.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
}

// Mở modal
function openModal(imgSrc) {
  modal.style.display = 'flex';
  modalImage.src = imgSrc;
  zoomLevel = 1;
  translateX = 0;
  translateY = 0;
  isPanning = false;
  updateImageTransform();
  
  // Thêm sự kiện touch cho mobile
  modalImage.addEventListener('touchstart', handleTouchStart, false);
  modalImage.addEventListener('touchmove', handleTouchMove, false);
}

// Đóng modal
function closeModal() {
  modal.style.display = 'none';
  modalImage.src = '';
  zoomLevel = 1;
  translateX = 0;
  translateY = 0;
  isPanning = false;
  updateImageTransform();
  
  // Gỡ bỏ các sự kiện khi đóng modal để tránh rò rỉ bộ nhớ
  modalImage.removeEventListener('touchstart', handleTouchStart);
  modalImage.removeEventListener('touchmove', handleTouchMove);
}

// Zoom ảnh
function zoomImage(factor) {
  currentScale *= factor;
  // Giới hạn scale từ 0.5 đến 3
  currentScale = Math.min(Math.max(0.5, currentScale), 3);
  modalImage.style.transform = `scale(${currentScale})`;
}

// Xử lý touch events cho mobile
let touchStartX = 0;
let touchStartY = 0;
let initialScale = 1;

function handleTouchStart(e) {
  if (e.touches.length === 2) {
    // Lưu khoảng cách ban đầu giữa 2 ngón tay
    touchStartX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
    touchStartY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
    initialScale = currentScale;
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    
    // Tính khoảng cách hiện tại giữa 2 ngón tay
    const currentX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
    const currentY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
    
    // Tính tỷ lệ scale dựa trên khoảng cách
    const scaleX = currentX / touchStartX;
    const scaleY = currentY / touchStartY;
    const scale = Math.max(scaleX, scaleY);
    
    // Áp dụng scale mới
    currentScale = initialScale * scale;
    currentScale = Math.min(Math.max(0.5, currentScale), 3);
    modalImage.style.transform = `scale(${currentScale})`;
  }
}

// Đóng modal khi click ra ngoài ảnh
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    closeModal();
  }
});