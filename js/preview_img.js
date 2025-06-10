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
function openModal(src) {
  // Reset tất cả trạng thái về mặc định mỗi khi mở ảnh mới
  zoomLevel = 1;
  translateX = 0;
  translateY = 0;
  isPanning = false;

  modalImage.src = src;
  updateImageTransform();
  modalImage.style.cursor = 'default'; // Con trỏ mặc định khi chưa zoom
  
  // Gắn các sự kiện để kéo ảnh
  modalImage.addEventListener('mousedown', onMouseDown);
  modalImage.addEventListener('mousemove', onMouseMove);
  // Mouseup và mouseleave trên toàn bộ modal để tránh mất sự kiện khi kéo quá nhanh
  modal.addEventListener('mouseup', onMouseUp);
  modal.addEventListener('mouseleave', onMouseUp);

  modal.style.display = "flex";
}

// Đóng modal
function closeModal() {
  modal.style.display = "none";
  
  // Gỡ bỏ các sự kiện khi đóng modal để tránh rò rỉ bộ nhớ
  modalImage.removeEventListener('mousedown', onMouseDown);
  modalImage.removeEventListener('mousemove', onMouseMove);
  modal.removeEventListener('mouseup', onMouseUp);
  modal.removeEventListener('mouseleave', onMouseUp);
}

// Phóng to / Thu nhỏ
function zoomImage(factor) {
  // Giới hạn mức zoom tối thiểu là 1 (kích thước gốc)
  const newZoomLevel = zoomLevel * factor;
  zoomLevel = newZoomLevel < 1 ? 1 : newZoomLevel;

  // Nếu zoom về 1 (kích thước gốc), reset vị trí kéo
  if (zoomLevel === 1) {
    translateX = 0;
    translateY = 0;
    modalImage.style.cursor = 'default';
  } else {
    modalImage.style.cursor = 'grab';
  }

  updateImageTransform();
}

// Đóng modal khi click ra ngoài ảnh (vẫn giữ nguyên)
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    closeModal();
  }
});