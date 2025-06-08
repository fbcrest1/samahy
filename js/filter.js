$(document).ready(function () {
  const table = $('#myTable');
  const rows = table.find('tbody tr');
  const activeFilters = {};

  // Tạo menu lọc cho từng cột
  function buildFilter(columnIndex) {
    const values = new Set();
    rows.each(function () {
      const cellText = $(this).find('td').eq(columnIndex).text().trim();
      // Chỉ thêm giá trị đơn lẻ, bỏ qua những cái có dấu "-"
      if (cellText && !cellText.includes('-')) {
        values.add(cellText.trim());
      }
    });

    const menu = $(`.filter-menu[data-column="${columnIndex}"]`);
    menu.empty();

    [...values].sort().forEach(value => {
      menu.append(`<label><input type="radio" name="filter-${columnIndex}" value="${value}"> ${value}</label>`);
    });

    menu.append(`<label><input type="radio" name="filter-${columnIndex}" value=""> Tất cả</label>`);
  }

  // Áp dụng bộ lọc
  function applyFilters() {
    rows.each(function () {
      const row = $(this);
      let show = true;

      for (const col in activeFilters) {
        const filterVal = activeFilters[col].normalize("NFC").toLowerCase().trim();
        const cellText = row.find('td').eq(col).text().normalize("NFC").toLowerCase().trim();
        const cellVals = cellText.split(/\s*-\s*/).map(val => val.trim());

        if (!cellVals.includes(filterVal)) {
          show = false;
          break;
        }
      }

      row.toggle(show);
    });
  }

  // Xử lý sự kiện click cho nút lọc
  $('.filter-btn').on('click', function (e) {
    e.stopPropagation();
    const columnIndex = $(this).data('column');
    const menu = $(`.filter-menu[data-column="${columnIndex}"]`);

    if (menu.hasClass('show')) {
      menu.removeClass('show');
    } else {
      $('.filter-menu').removeClass('show');
      buildFilter(columnIndex);
      menu.addClass('show');

      // Điều chỉnh vị trí menu trên mobile
      if (window.innerWidth <= 768) {
        const btnRect = this.getBoundingClientRect();
        const menuWidth = menu.width();
        const menuHeight = menu.height();
        
        // Tính toán vị trí để menu không bị tràn màn hình
        let left = btnRect.left;
        let top = btnRect.bottom + 5;
        
        // Nếu menu sẽ bị tràn bên phải
        if (left + menuWidth > window.innerWidth) {
          left = window.innerWidth - menuWidth - 10;
        }
        
        // Nếu menu sẽ bị tràn bên dưới
        if (top + menuHeight > window.innerHeight) {
          top = btnRect.top - menuHeight - 5;
        }
        
        menu.css({
          position: 'fixed',
          left: left + 'px',
          top: top + 'px'
        });
      }
    }
  });

  // Xử lý sự kiện thay đổi giá trị filter
  $('.filter-menu').on('change', 'input[type="radio"]', function () {
    const columnIndex = $(this).closest('.filter-menu').data('column');
    const selectedValue = $(this).val();

    if (selectedValue) {
      activeFilters[columnIndex] = selectedValue;
    } else {
      delete activeFilters[columnIndex];
    }

    applyFilters();
    $('.filter-menu').removeClass('show');
  });

  // Ẩn menu filter khi click ngoài
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.filter-menu, .filter-btn').length) {
      $('.filter-menu').removeClass('show');
    }
  });

  // Xử lý sự kiện resize window
  let resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      $('.filter-menu').removeClass('show');
    }, 250);
  });
});
